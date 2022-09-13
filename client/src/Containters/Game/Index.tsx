import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PlayerList from "../Lobby/PlayerList";
import { postData } from "../../ApiHelper";
import GenericButton from "../../Components/GenericButton";
import { useModal } from "../../ModalContext";
import PlayerFocusCard from "../PlayerFocusCard";
import { Player } from "../../Types/Types";
import useGameStateQuery from "../../Hooks/GameDataHook";
import socket from "../../Hooks/WebsocketHook";
import style from "./Game.module.css";

type VotePayload = {
	gameId: number,
	candidateId: number,
	phase: string
}

type FinishRoundPayload = {
	gameId: number,
	phase: string
}

type Verdict = {
	player: Player,
	sentence: string
}

interface VoteResult {
	verdict: string
}

const sendVote = async (vote: VotePayload): Promise<VoteResult> => postData("/vote", vote);
const finishRound = async (roundData: FinishRoundPayload): Promise<Verdict> => postData("/tallyVote", roundData);
const beginNight = async (gameId : number): Promise<void> => postData("/startNight", { gameId });

function Game(): JSX.Element {
	const { callModal } = useModal();
	const [hasResult, setHasResult] = useState(false);
	const [votingResults, setVotingResults] = useState();

	const { gameQueryIsLoading, gameQueryError, gameData } = useGameStateQuery();
	const queryClient = useQueryClient();

	if (gameQueryError instanceof Error) {
		callModal(gameQueryError.message);
	}

	useEffect(() => {
		if (socket) {
			socket.on("vote_results", (player) => {
				setVotingResults(player);
				setHasResult(true);
			});

			socket.on("vote_results_tie", () => {
				setHasResult(true);
				alert("Tie");
			});

			socket.on("start_night", () => {
				setHasResult(false);
				alert("Starting Night");
			});
		
			return () => {
				socket.off("vote_results");
				socket.off("vote_results_tie");
				socket.off("start_night");
			};
		}
		
	}, []);

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
				candidateId: candidateId,
				phase: "day"
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
				gameId: gameData?.game.id,
				phase: "day"
			});
		}
	};

	const startNightMutation = useMutation(beginNight, {
		onSuccess: () => {
			queryClient.invalidateQueries(["games"]);
		},
		onError: (error) => {
			if (error instanceof Error) {
				callModal(error.message);
			}
		}
	});

	const startNight = (gameId: number) => {
		if (gameId) {
			startNightMutation.mutate(gameId);
		}
		setHasResult(false);
		console.log("Starting night");
	};

	const team = gameData?.thisPlayer.team ? gameData.thisPlayer.team : "";
	
	return (
		<React.Fragment>
			{gameData ? 
				<React.Fragment>
					<p className={`${style["team"]} ${style[team]}`}>{gameData.thisPlayer.team}</p>
					{!gameQueryIsLoading ? <PlayerList players={gameData.players} castVote={finishVote} isLobby={false} socket={socket} /> : <p>...loading</p> }
					{hasResult && votingResults ? <PlayerFocusCard player={votingResults} /> : null}
					{hasResult ? <GenericButton text="Start Night" onClick={() => startNight(gameData.game.id)} /> : <GenericButton text="End Round" onClick={endRound} />}
				</React.Fragment> : <p>...loading</p>}
		</React.Fragment>
	);
}

export default Game;