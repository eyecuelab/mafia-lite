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
	gameId: number,
	lobbyName: string
}

const getLobbyMembers = async (gameId: number): Promise<LobbyMembers[]> => {
	const url = `${API_ENDPOINT}/players/${gameId}`;
	const response = await fetch(url, { ...BASE_HEADERS });
	return await handleResponse(response);
}

const notify = (content: string) => toast(content);

const Lobby = (): JSX.Element => {
	const location = useLocation();
	const state = location.state as CustomizedState
	const { gameId, lobbyName } = state;

	const queryClient = useQueryClient();
	const { isLoading, error, data } = useQuery(["players"], () => getLobbyMembers(gameId));
	const [socket, setSocket] = useState(io(API_ENDPOINT))
	const [gameStarted, setGameStarted] = useState(false) //socket
	const [usersJoined, setUsersJoined] = useState([])

	useEffect(() => {
		//Establish connection when component mounts
		socket.on('connect', () => {

			socket.emit("join_room", gameId)
			socket.on("get_players_in_room", (PLAYERS_IN_ROOM) => {
				setUsersJoined(PLAYERS_IN_ROOM)
			})
			socket.on("player_joined_msg", (data) => notify(data))

			socket.on("new_game_clicked", () => {
				// console.log("New Game Button Clicked")
			})
		})
	}, [socket])


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

	if (error instanceof Error) {
		return <p>'An error has occurred: {error.message}</p>;
	}

	if (isLoading) {
		queryClient.invalidateQueries(['games']);
	}

	const playerNames = data ? data.map((player, index) => {
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
			<h1>{lobbyName}</h1>
			{isLoading && (<p>Loading...</p>)}
			{!isLoading && <List listItems={playerNames} />}

			<GenericButton
				onClick={() => gameStartSwitch()}
				text={gameStarted ? 'Game Started' : 'New Game'} />

			<ToastContainer />
		</div >
	);
}

export default Lobby;