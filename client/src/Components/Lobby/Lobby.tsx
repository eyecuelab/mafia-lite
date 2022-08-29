import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from "socket.io-client";
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../../ApiHelper";
import GenericButton from '../GenericButton';
import List, { listItem } from "../List";

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

const notify = (content: string) => toast(content);

const Lobby = (): JSX.Element => {
	const location = useLocation();
	const state = location.state as CustomizedState
	const { gameId } = state;

	const queryClient = useQueryClient();
	const {  isLoading: lobbyLoading, error: lobbyError, data: players } = useQuery(["players"], () => getLobbyMembers(gameId));
	const { isLoading: lobbyNameLoading, error: lobbyNameError, data: gameData } = useQuery(["players"], () => getLobbyName(gameId));
	const [socket, setSocket] = useState(io(API_ENDPOINT))
	const [gameStarted, setGameStarted] = useState(false) //socket
	const [usersJoined, setUsersJoined] = useState([])

	useEffect(() => {
		//Establish connection when component mounts
		socket.on('connect', () => {

			socket.on("player_joined_msg", (data) => notify("New player joined"))
			//Listen for game start and dictate the data passed through the sockets

			socket.on("new_game_clicked", () => {
				// console.log("New Game Button Clicked")
			})
		})
	}, [socket])

	//Listen for the new game to start
	socket.on("new_game_start", (arg) => {
		setUsersJoined(arg)
		notify("New Game Started!")
	})

	//Use placeholder to pass data obj through to server later
	const userAndRoomDataPlaceholder = {
		user: players, //To contain all users active in room
		roomId: "123", //Placeholder for Game ID
		socketId: socket.id
	}

	//Start the actual game
	const gameStartSwitch = () => {
		if (!gameStarted) {
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
			style: {display: `flex`},
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

			<ToastContainer />
		</div >
	);
}

export default Lobby;