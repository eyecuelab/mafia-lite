import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import io from "socket.io-client";
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../../ApiHelper";
import GenericButton from '../GenericButton';
import List, { listItem } from "../List";
import { useNotify } from '../useToastify';

interface LobbyMembers {
	id: number
	isHost: boolean,
	name: string,
	avatar: string
}

interface CustomizedState {
	gameId: number
}

interface Game {
	name: string
}

const getLobbyMembers = async (gameId: number): Promise<LobbyMembers[]> => {
	const url = `${API_ENDPOINT}/players/${gameId}`;
	const response = await fetch(url, { ...BASE_HEADERS });
	return await handleResponse(response);
}

const getLobbyName = async (gameId: number): Promise<Game> => {
	const url = `${API_ENDPOINT}/game/${gameId}`;
	const response = await fetch(url, { ...BASE_HEADERS });
	return await handleResponse(response);
}

const Lobby = (): JSX.Element => {
	const location = useLocation();
	const state = location.state as CustomizedState
	const { gameId } = state;

	const { isLoading: lobbyLoading, error: lobbyError, data: players } = useQuery(["players"], () => getLobbyMembers(gameId));
	const { isLoading: lobbyNameLoading, error: lobbyNameError, data: gameData } = useQuery(["games"], () => getLobbyName(gameId));

	const [socket, setSocket] = useState(io(API_ENDPOINT))
	const [lobbyEntered, setLobbyEntered] = useState(false)
	const [gameStarted, setGameStarted] = useState(false)
	const [usersJoined, setUsersJoined] = useState([])


	useEffect(() => {
		const lobbyEnteredHandler = () => setLobbyEntered(!lobbyEntered)

		//Establish connection when component mounts
		socket.on('connect', () => {
			//Alert server we've joined room
			socket.emit("join_room", gameId)
			// socket.on("player_joined_msg", (data) => useNotify(data))
		})

		return (() => {
			lobbyEnteredHandler()
		})
	}, [lobbyEntered])

	//Perform logic on backend and receive players in game data from backend
	socket.on("get_players_in_room", (PLAYERS_IN_ROOM) => setUsersJoined(PLAYERS_IN_ROOM))


	//Use placeholder to pass data obj through to server later
	const userAndRoomDataPlaceholder = {
		players: usersJoined, //To contain all users active in room
		roomId: gameId, //Placeholder for Game ID
		socketId: socket.id
	}

	//Start the actual game
	const gameStartSwitch = () => {
		if (!gameStarted) {
			console.log(`gameStartSwitch`, userAndRoomDataPlaceholder)
			socket.emit("new_game_clicked", userAndRoomDataPlaceholder);
		}
		setGameStarted(!gameStarted)
	}

	if (lobbyError instanceof Error) {
		return <p>'An error has occurred: {lobbyError.message}</p>;
	}

	const playerNames = players ? players.map((player, index) => {
		const item: listItem = {
			id: index,
			style: { display: `flex` },
			data:
				<React.Fragment>
					<img style={{ width: `20%` }} src={`${player.avatar}`} />
					<h4>{player.name}</h4>
				</React.Fragment>
		};
		return item;
	}) : []

	return (
		<div>
			<h1>{gameData?.name}</h1>
			{lobbyLoading && (<p>Loading...</p>)}
			{!lobbyLoading && <List listItems={playerNames} />}

			<GenericButton
				onClick={() => gameStartSwitch()}
				text={gameStarted ? 'Game Started' : 'New Game'} />

		</div >
	);
}

export default Lobby;