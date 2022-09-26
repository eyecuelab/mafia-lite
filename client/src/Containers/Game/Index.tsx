import React, { useEffect, useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "../../ApiHelper";
import { useModal } from "../../ModalContext";
import { Player } from "../../Types/Types";
import useGameStateQuery from "../../Hooks/GameDataHook";
import socket from "../../Hooks/WebsocketHook";
import DayTime from "./DayTime";
import NightTime from "./NightTime";
import style from "./Game.module.css";
import GameOver from "./GameOver";
import PlayerFocusCard from "../PlayerFocusCard";
import GhostView from "./GhostView";
import AllChat from "../../Components/Chat/AllChat";
import CultistChat from "../../Components/Chat/CultistChat";
import GhostChat from "../../Components/Chat/GhostChat";
import ChatContainer from "../../Components/Chat/ChatContainer";

type VoteResults = {
	result: "tie" | "success",
	player: Player | null,
}

type VotePayload = {
	gameId: number,
	candidateId: number
}

type FinishRoundPayload = {
	gameId: number
}

type Verdict = {
	player: Player,
	sentence: string
}

type GameEndData = {
	cultistsWin: boolean
	winners: Player[]
}

const sendVote = async (vote: VotePayload): Promise<Verdict> => postData("/vote", vote);
const finishRound = async (roundData: FinishRoundPayload): Promise<Verdict> => postData("/tallyVote", roundData);

function Game(): JSX.Element {
	const { callModal } = useModal();
	const [ hasResult, setHasResult ] = useState(false);
	const [ votingResults, setVotingResults ] = useState<Player>();
	const [ randomKill, setRandomKill ] = useState(false);
	const [ gameEndData, setGameEndData ] = useState<GameEndData>();
	const { gameQueryError, gameData } = useGameStateQuery();
	const [ timeRemaining, setTimeRemaining ] = useState(180);
	const queryClient = useQueryClient();

	if (gameQueryError instanceof Error) {
		callModal(gameQueryError.message);
	}

	const handleGameState = useCallback(({ votingResults, hasResult }: { votingResults?: Player, hasResult: boolean }) => {
		if (votingResults) {
			setVotingResults(votingResults);
		}

		setHasResult(hasResult);

		queryClient.invalidateQueries(["games"]);
	}, [queryClient]);

	const gameId = gameData?.game?.id;
	const thisPlayerId = gameData?.thisPlayer.id;
	const thisPlayerDisconnected = gameData?.thisPlayer.isDisconnected;

	useEffect(() => {
		if (thisPlayerDisconnected) {
			socket.emit("reconnect", gameId, thisPlayerId);
		}

		socket.on("vote_results", (voteResults: VoteResults) => {
			if (voteResults.result === "tie") {
				if (voteResults.player) {
					setRandomKill(true);
					handleGameState({ hasResult: true, votingResults: voteResults.player });
				} else {
					setVotingResults(undefined);
					handleGameState({ hasResult: true });
				}
			} else if (voteResults.player) {
				handleGameState({ hasResult: true, votingResults: voteResults.player });
			}
		});

		socket.on("start_night", () => {
			handleGameState({ hasResult: false });
		});

		socket.on("tick", (timeRemaining: number) => {
			console.log("timer tick", { timeRemaining });
			setTimeRemaining(timeRemaining);
		});

		socket.on("start_day", () => {
			setRandomKill(false);
			handleGameState({ hasResult: false });
		});

		socket.on("game_player_disconnect", () => {
			queryClient.invalidateQueries(["games"]);
		});

		socket.on("end_game", (gameEndData: { cultistsWin: boolean, winners: Player[] }) => {
			setGameEndData(gameEndData);
		});
		
		return () => {
			socket.off("vote_results");
			socket.off("tick");
			socket.off("start_night");
			socket.off("start_day");
			socket.off("end_game");
			socket.off("game_player_disconnect");
		};
	}, [gameId, handleGameState, queryClient, thisPlayerDisconnected, thisPlayerId]);

	const voteMutation = useMutation(sendVote, {
		onSuccess: () => {
			console.log("vote sent");
		},
		onError: (error) => {
			if (error instanceof Error) {
				callModal(error.message);
			}
		}
	});

	const castVote = (candidateId: number) => {
		if (gameData?.game.id) {
			voteMutation.mutate({
				gameId: gameData.game.id,
				candidateId: candidateId
			});
		}
	};

	const finishRoundMutation = useMutation(finishRound, {
		onSuccess: () => {
			queryClient.invalidateQueries(["games"]);
		},
		onError: (error) => {
			if (error instanceof Error) {
				callModal(error.message);
			}
		}
	});

	const endRound = () => {
		if (gameData?.game.id) {
			finishRoundMutation.mutate({
				gameId: gameData?.game.id
			});
		}
	};
	
	const focusView = () => {
		if (gameData) {
			if (hasResult && votingResults) {
				return <PlayerFocusCard player={votingResults} tie={false} nightTie={randomKill} />;
			} else if (hasResult && !votingResults) {
				return <PlayerFocusCard player={votingResults} tie={true} nightTie={randomKill} />;
			} else if (gameData.thisPlayer.status === "murdered" || gameData.thisPlayer.status === "terminated" || gameData.currentRound?.currentPhase === "day") {
				return <GhostView gameData={gameData} />;
			} else {
				return null;
			}
		}
	};

	if (gameEndData) {
		return (
			<GameOver winners={gameEndData.winners} cultistsWin={gameEndData.cultistsWin} />
		);
	} else {
		const team = gameData?.thisPlayer.team ? gameData.thisPlayer.team : "";
		return (
			<React.Fragment>
				<p className={`${style["team"]} ${style[team]}`}>{gameData?.thisPlayer.team}</p>
				{gameData && <ChatContainer sender={gameData?.thisPlayer} />}
				{gameData ?  (
					(
						(gameData.currentRound?.currentPhase === "day") ? 
							(<DayTime gameData={gameData} hasResult={hasResult} votingResults={votingResults} castVote={castVote} endRound={endRound} focusView={focusView} timeRemaining={timeRemaining} />) 
							: 
							(<NightTime gameData={gameData} hasResult={hasResult} votingResults={votingResults} castVote={castVote} endRound={endRound} focusView={focusView} timeRemaining={timeRemaining} />)
					)
				) : <p>...loading</p>}
			</React.Fragment>
		);
	}
	
}

export default Game;