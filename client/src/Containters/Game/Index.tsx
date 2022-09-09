import React, { useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import PlayerList from "../Lobby/PlayerList";
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../../ApiHelper";
import GenericButton from "../../Components/GenericButton";
import { useModal } from "../../ModalContext";
// import { useLocation } from "react-router-dom";

// interface CustomizedState {
// 	gameId: number,
// 	playerId: number
// }

type VotePayload = {
	gameId: number,
	candidateId: number,
	phase: string
}

type finishRoundPayload ={
	gameId: number,
	phase: string
}

type Player = {
	id: number
	isHost: boolean
	name: string
	gameId: number
	avatar: string
}

type Game = {
	id: number
	players: Array<Player>
	gameCode: string
	name: string
	size: number
}

interface GameData {
	game: Game,
	players: Player[]
}

interface VoteResult {
	verdict: string
}

const getUserGameState = async (): Promise<GameData> => {
	const url = `${API_ENDPOINT}/player/game`;
	const response = await fetch(url, { ...BASE_HEADERS });
	return await handleResponse(response);
};

const sendVote = async (vote: VotePayload): Promise<VoteResult> => {
	const url = `${API_ENDPOINT}/vote`;
	const response = await fetch(url, { ...BASE_HEADERS, method: "POST", body: JSON.stringify(vote) });
	return await handleResponse(response);
};

const finishRound = async (roundData: finishRoundPayload): Promise<string> => {
	const url = `${API_ENDPOINT}/tallyVote`;
	const response = await fetch(url, { ...BASE_HEADERS, method: "POST", body: JSON.stringify(roundData) });
	return await handleResponse(response);

};

const socket: Socket = io(API_ENDPOINT);

function Game(): JSX.Element {
	const { callModal } = useModal();

	const { data: gameData } = useQuery(["games"], getUserGameState);

	useEffect(() => {
		socket.on("connection", (socket: Socket) => {
			socket.emit("join_room", gameData?.game.id);
			console.log("game joined", socket.id);
		});

		return () => {
			socket.off("connection");
		};
	}, [gameData]);


	const voteMutation = useMutation(sendVote, {
		onSuccess: (data) => {
			// move to show verdict
			console.log("Verdict: " + data.verdict);
		},
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
		onSuccess: (data) => {
			// move to show verdict
			console.log("Verdict: " + data);
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

	return (
		<React.Fragment>
			{ gameData ? <PlayerList players={gameData.players} castVote={finishVote} isLobby={false} /> : <p>...loading</p> }
			{/* <GenericButton text="End Voting" onClick={finishVote} /> */}
			<GenericButton text="End Round" onClick={endRound} />
		</React.Fragment>
	);
}

export default Game;