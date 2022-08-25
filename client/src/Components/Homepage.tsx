
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { Fragment, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from "socket.io-client";
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../ApiHelper";
import titleImg from "../assets/The Nameless Terror Images/Title.png";
import buttonImg from "../assets/The Nameless Terror Images/UI/image\ 15.png";
import GenericButton from '../Components/GenericButton';


type GameCreateInput = {
	name: string
}

interface Game extends GameCreateInput {
	id: string;
	createdAt: string;
	endedAt?: string;
}

const getGames = async (): Promise<Game[]> => {
	const url = `${API_ENDPOINT}/game`;
	const response = await fetch(url, { ...BASE_HEADERS });
	return await handleResponse(response);
}

const createGame = async (username: GameCreateInput) => {
	const url = `${API_ENDPOINT}/game`;
	const response = await fetch(url, { ...BASE_HEADERS, method: "POST", body: JSON.stringify(username) });
	return await handleResponse(response);
}

function Homepage() {
	const [hostName, setHostName] = useState("");
	const { isLoading, error, data: games } = useQuery(["games"], getGames);
	const queryClient = useQueryClient();
	const [socket, setSocket] = useState(io(API_ENDPOINT))

	const gameMutation = useMutation(createGame, {
		onSuccess: (data) => {
			queryClient.invalidateQueries(['games']);
		},
		onError: (error) => {
			if (error instanceof Error) {
				// Do something with the error
				alert(`Oops! ${error.message}`);
			}
		}
	})

	if (isLoading) {
		queryClient.invalidateQueries(['games']);
	}

	if (error instanceof Error) {
		return <p>'An error has occurred: {error.message}</p>
	}

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		gameMutation.mutate({
			name: hostName
		});
	}

	/*	Notify with toastify, listen for a message, join room function*/
	const notify = (content: string) => toast(content);

	socket.on("message", data => notify(data))

	const joinExistingGame = (IdOfGame: string) => {
		let existingGameParams = {
			roomId: IdOfGame
		}
		// props.openLobby(IdOfGame);
		socket.emit("join_room", existingGameParams);
		console.log(socket.id)
	}

	return (
		<div>
			<img src={titleImg} alt="The Nameless Terror" />
			<form onSubmit={onSubmit}>
				<input name="name" placeholder="Enter Name" onChange={e => setHostName(e.target.value)} />
				<GenericButton
					link={"/lobby"}
					type={"submit"}
					text={"Host Game"}
					style={
						{
							background: `url("${buttonImg}") no-repeat`,
							width: "1348px",
							height: "151px"
						}
					}
				/>
			</form>
			{/* <<<<<<< HEAD:client/src/Containers/Homepage.tsx
	<div>
		<h2>Existing Games:</h2>
		{isLoading && <p>Loading...</p>}
		{games?.map(game => {
			console.log(games)
			return (
				<button
					key={game.id}
					onClick={() => {
						notify(`Game: ${game.id} clicked!`);
						joinExistingGame(game.id);
						console.log(game.id)
					}}>
					<p>game: {game.id}</p>
					<ToastContainer />
				</button>
			);
		})}
		{!isLoading && !games?.length && (
			<p>No games</p>
		)} */}
			<GenericButton
				text={"Join Game"}
				style={
					{
						background: `url("${buttonImg}") no-repeat`,
						width: "1348px",
						height: "151px"
					}
				}
			/>

		</div >
	);
}

export default Homepage;