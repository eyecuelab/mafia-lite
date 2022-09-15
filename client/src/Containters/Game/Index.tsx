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
	gameOver: boolean
	cultistsWin: boolean
	winners: Player[]
}

const sendVote = async (vote: VotePayload): Promise<Verdict> => postData("/vote", vote);
const finishRound = async (roundData: FinishRoundPayload): Promise<Verdict> => postData("/tallyVote", roundData);

function Game(): JSX.Element {
	const { callModal } = useModal();
	const [hasResult, setHasResult] = useState(false);
	const [votingResults, setVotingResults] = useState<Player>();
	const [isDay, setIsDay] = useState(true);
	const [gameEndData, setGameEndData] = useState<GameEndData>();
	const { gameQueryError, gameData } = useGameStateQuery();
	const queryClient = useQueryClient();

	if (gameQueryError instanceof Error) {
		callModal(gameQueryError.message);
	}

	const handleGameState = ({ votingResults, hasResult, isDay }: { votingResults?: Player, hasResult: boolean, isDay?: boolean }) => {
		if (votingResults) { setVotingResults(votingResults); }
		if (isDay !== undefined) { setIsDay(isDay); }
		setHasResult(hasResult);

		queryClient.invalidateQueries(["games"]);
	};

	useEffect(() => {
		if (socket) {
			socket.on("vote_results", (player: Player) => {
				handleGameState({ votingResults: player, hasResult: true });
			});

			socket.on("vote_results_tie", () => {
				handleGameState({ hasResult: true, votingResults: undefined });
				console.log("line - 58 - Game/Index.tsx");
				alert("Tie");
			});

			socket.on("start_night", () => {
				handleGameState({ hasResult: false, isDay: false });
			});

			socket.on("start_day", () => {
				handleGameState({ hasResult: false, isDay: true });
			});

			socket.on("end_game", (cultistsWin: boolean, winners: Player[]) => {
				setGameEndData({ gameOver: true, cultistsWin, winners });
			});
		
			return () => {
				socket.off("vote_results");
				socket.off("vote_results_tie");
				socket.off("start_night");
				socket.off("start_day");
			};
		}
	});

	const voteMutation = useMutation(sendVote, {
		onError: (error) => {
			if (error instanceof Error) {
				callModal(error.message);
			}
		}
	});

	const finishVote = (candidateId: number) => {
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
	
	if (gameEndData?.gameOver) {
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
						(isDay) ? (<DayTime gameData={gameData} hasResult={hasResult} votingResults={votingResults} finishVote={finishVote} endRound={endRound} />) : (<NightTime gameData={gameData} hasResult={hasResult} votingResults={votingResults} finishVote={finishVote} endRound={endRound} />)
					)
				) : <p>...loading</p>}
			</React.Fragment>
		);
	}
	
}

export default Game;