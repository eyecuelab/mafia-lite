import React from "react";
import { useQuery } from "@tanstack/react-query";
import PlayerList from "../Lobby/PlayerList";
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../../ApiHelper";
// import { useLocation } from "react-router-dom";

// interface CustomizedState {
// 	gameId: number,
// 	playerId: number
// }

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

const getUserGameState = async (): Promise<GameData> => {
	const url = `${API_ENDPOINT}/player/game`;
	const response = await fetch(url, { ...BASE_HEADERS });
	return await handleResponse(response);
};

function Game() {
	const { isLoading: gameQueryLoading, error: gameQueryError, data: gameData } = useQuery(["game"], getUserGameState);

	return (
		<React.Fragment>
			{ gameData != undefined ? <PlayerList players={gameData.players} /> : <p>...loading</p> }
		</React.Fragment>
	);
}

export default Game;