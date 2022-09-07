import React, { useState } from "react";
import io from "socket.io-client";
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

type Player = {
	id: number
	isHost: boolean
	name: string
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

function Game() {
	const { callModal } = useModal();

	const { isLoading: gameQueryLoading, error: gameQueryError, data: gameData } = useQuery(["game"], getUserGameState);
	const [vote, setVote] = useState(-1);
	const [socket, setSocket] = useState(io(API_ENDPOINT));

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

	const finishVote = () => {
		if (gameData?.game.id) {
			voteMutation.mutate({
				gameId: gameData.game.id,
				candidateId: vote,
				phase: "day"
			});
		}
	};

	//socket.emit("accuse_player", )

	return (
		<React.Fragment>
			{ gameData != undefined ? <PlayerList players={gameData.players} setVote={setVote} /> : <p>...loading</p> }
			<GenericButton text="End Voting" onClick={finishVote} />
		</React.Fragment>
	);
}

export default Game;