
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from "socket.io-client";
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../../ApiHelper";
import titleImg from "../../assets/The Nameless Terror Images/Title.png";
import buttonImg from "../../assets/The Nameless Terror Images/UI/image\ 15.png";
import GenericButton from '../GenericButton';
import HomepageCSS from './Homepage.module.css';

type GameCreatePayload = {
	name: string,
	isHost: boolean,
	avatar: string
}

type JoinGamePayload = {
	name: string
	gameCode: string
	avatar: string
}

interface Game extends GameCreatePayload {
	id: string;
	createdAt: string;
	endedAt?: string;
}

const getGames = async (): Promise<Game[]> => {
	const url = `${API_ENDPOINT}/game`;
	const response = await fetch(url, { ...BASE_HEADERS });
	return await handleResponse(response);
}

const createGame = async (createGamePayload: GameCreatePayload) => {
	const url = `${API_ENDPOINT}/game`;
	const response = await fetch(url, { ...BASE_HEADERS, method: "POST", body: JSON.stringify(createGamePayload) });
	return await handleResponse(response);
}

const joinGame = async (joinGamePayload: JoinGamePayload) => {
	const url = `${API_ENDPOINT}/game/join`;
	const response = await fetch(url, { ...BASE_HEADERS, method: "POST", body: JSON.stringify(joinGamePayload) });
	return await handleResponse(response);
}


function Homepage() {
	const [userName, setUserName] = useState("");
	const [gameCode, setGameCode] = useState("");
	const { isLoading, error, data: games } = useQuery(["games"], getGames);
	const queryClient = useQueryClient();
	const [socket, setSocket] = useState(io(API_ENDPOINT))
	const navigate = useNavigate();

	const joinGameMutation = useMutation(joinGame, {
		onSuccess: (data) => {
			navigate("/lobby", { state: { gameId: data.game.id }, replace: true });
		},
		onError: (error) => {
			if (error instanceof Error) {
				// Do something with the error
				alert(`Oops! ${error.message}`);
			}
		}
	})

	const gameMutation = useMutation(createGame, {
		onSuccess: (data) => {
			navigate("/lobby", { state: { gameId: data.game.id }, replace: true });
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

	const randomlyGenerateAvatar = () => {
		let randomImageNumber = Math.floor(Math.random() * (192 - 181) + 181)
		const avatarBasePath = `/assets/The Nameless Terror Images/Portraits/image\ ${randomImageNumber}.png`
		return avatarBasePath
	}

	const onHostButtonClick = async () => {
		// e.preventDefault();
		const getAvatar = randomlyGenerateAvatar();

		await gameMutation.mutate({
			name: userName,
			isHost: true,
			avatar: getAvatar
		});
		// navigate(routePath)
	}

	const onJoinButtonClick = async (e: React.FormEvent) => {
		e.preventDefault();
		const getAvatar = randomlyGenerateAvatar();
		await joinGameMutation.mutateAsync({
			name: userName,
			gameCode: gameCode,
			avatar: getAvatar
		})
	}

	/*** Socket Functions ***/

	const notify = (content: string) => toast(content);

	socket.on("message", data => notify(data))
	const joinExistingGame = (IdOfGame: string) => {
		let existingGameParams = {
			roomId: IdOfGame
		}
		socket.emit("join_room", existingGameParams);
	}

	/***/


	return (
		<>
			<div className={HomepageCSS["homepage-title-wrapper"]}>
				<img src={titleImg} className={HomepageCSS.titleImage} alt="The Nameless Terror" />
				<h5>A Lovecraftian Inspired Mafia Game</h5>
			</div>

			<div className={HomepageCSS["hostOrJoinBtns-wrapper"]}>
				{/* <form className={HomepageCSS.form} onSubmit={(e) => onHostButtonClick('/lobby', e)}> */}
				<input name="name"
					className="user-selection-input"
					placeholder="Enter Name"
					onChange={e => setUserName(e.target.value)} />

				<input name="gameCode"
					placeholder="Enter Game Code"
					onChange={e => setGameCode(e.target.value)} />

				<GenericButton
					className={HomepageCSS["user-selection-input"]}
					type={"submit"}
					text={"Host Game"}
					style={
						{
							background: `url("${buttonImg}")`,
						}
					}
					onClick={onHostButtonClick}
				/>
				{/* </form> */}

				<GenericButton
					className={HomepageCSS["user-selection-input"]}
					text={"Join Game"}
					style={
						{
							background: `url("${buttonImg}")`,
						}
					}
					onClick={onJoinButtonClick}
				/>

			</div>
		</>
	);
}

export default Homepage;