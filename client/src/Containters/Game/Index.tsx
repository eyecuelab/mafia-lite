import React, { useEffect, useState } from "react";
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
	const queryClient = useQueryClient();

	if (gameQueryError instanceof Error) {
		callModal(gameQueryError.message);
	}

	const handleGameState = ({ votingResults, hasResult }: { votingResults?: Player, hasResult: boolean }) => {
		if (votingResults) { setVotingResults(votingResults); }
		setHasResult(hasResult);

		console.log("🚀 ~ file: Index.tsx ~ line 51 ~ handleGameState ~ votingResults, hasResult", votingResults, hasResult);

		queryClient.invalidateQueries(["games"]);
	};

	useEffect(() => {
		socket.on("vote_results", (player: Player) => {
			handleGameState({ votingResults: player, hasResult: true });
		});

		socket.on("vote_results_tie", () => {
			setVotingResults(undefined);
			handleGameState({ hasResult: true, votingResults: undefined });
		});

		socket.on("vote_results_tie_night", (player: Player) => {
			setRandomKill(true);
			handleGameState({ hasResult: true, votingResults: player });
		});

		socket.on("start_night", () => {
			handleGameState({ hasResult: false });
		});

		socket.on("start_day", () => {
			setRandomKill(false);
			handleGameState({ hasResult: false });
		});

		socket.on("end_game", (gameEndData: { cultistsWin: boolean, winners: Player[] }) => {
			setGameEndData(gameEndData);
		});
		
		return () => {
			socket.off("vote_results");
			socket.off("vote_results_tie");
			socket.off("vote_results_tie_night");
			socket.off("start_night");
			socket.off("start_day");
			socket.off("end_game");
		};
	}, []);

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
			} else if(hasResult && !votingResults) {
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
				{gameData ?  (
					(
						(gameData.currentRound?.currentPhase === "day") ? 
							(<DayTime gameData={gameData} hasResult={hasResult} votingResults={votingResults} castVote={castVote} endRound={endRound} focusView={focusView} />) 
							: 
							(<NightTime gameData={gameData} hasResult={hasResult} votingResults={votingResults} castVote={castVote} endRound={endRound} focusView={focusView} />)
					)
				) : <p>...loading</p>}
			</React.Fragment>
		);
	}
	
}

export default Game;