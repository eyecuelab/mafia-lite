import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { Fragment, useEffect, useState } from 'react';
import io from "socket.io-client";
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../ApiHelper";
import GenericButton from '../Components/GenericButton';
import List, { listItem } from "../Components/List";

type propTypes = {
	gameId: number
}

interface LobbyMembers {
	id: number
	isHost: boolean,
	name: string,
}

const getLobbyMembers = async (gameId: number): Promise<LobbyMembers[]> => {
	const url = `${API_ENDPOINT}/players/${gameId}`;
	const response = await fetch(url, { ...BASE_HEADERS });
	return await handleResponse(response);
}


const Lobby = (props: propTypes): JSX.Element => {
	const queryClient = useQueryClient();
	const { isLoading, error, data } = useQuery(["players"], () => getLobbyMembers(props.gameId));
	const socket = io(API_ENDPOINT);
	const [gameStarted, setGameStarted] = useState(false)
	const [usersJoined, setUsersJoined] = useState([])

	// useEffect(() => {
	//Establish connection when component mounts
	socket.on('connect', () => {
		console.log('socket open', socket.id);
		socket.emit('newRoom', socket.id);
	})
	// }, [])

	//Listen for game start and dictate the data passed through the sockets
	socket.on("newGameClicked", () => {
		console.log("New Game Button Clciked")
	})

	//Listen for the 
	socket.on("newGameStart", (arg) => {
		console.log("New Game Starting", arg)
		setUsersJoined(arg)
	})

	//Use placeholder to pass data obj through to server later
	const userAndRoomDataPlaceholder = {
		userId: data, //To contain all users active in room
		roomId: "123" //Placeholder for Game ID
	}
	//Start the actual game
	const gameStartSwitch = () => {
		!gameStarted && socket.emit("newGameClicked", userAndRoomDataPlaceholder)
		setGameStarted(!gameStarted)
	}

	if (error instanceof Error) {
		return <p>'An error has occurred: {error.message}</p>;
	}

	if (isLoading) {
		queryClient.invalidateQueries(['games']);
	}

	const playerNames = data ? data.map((player, index) => {
		const item: listItem = { id: index, data: player.name };
		return item;
	}) : []


	return (
		<div>
			<h1>Lobby</h1>
			{isLoading && (<p>Loading...</p>)}
			{!isLoading && <List listItems={playerNames} />}
			{usersJoined.map(each => <h5> User ID#: {each} joined</h5>)}

			<GenericButton
				onClick={() => gameStartSwitch()}
				text={gameStarted ? 'Game Started' : 'New Game'} />

		</div >
	);
}

export default Lobby;