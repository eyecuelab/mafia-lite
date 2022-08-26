
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from "socket.io-client";
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../../ApiHelper";
// import testAvatar from "../../assets/The Nameless Terror Images/Portraits/image\ 181.png";
import titleImg from "../../assets/The Nameless Terror Images/Title.png";
import buttonImg from "../../assets/The Nameless Terror Images/UI/image\ 15.png";
import GenericButton from '../GenericButton';
import HomepageCSS from './Homepage.module.css';

type GameCreateInput = {
	name: string,
	avatar: string
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
	const [userName, setUserName] = useState("");
	const { isLoading, error, data: games } = useQuery(["games"], getGames);
	const queryClient = useQueryClient();
	const [socket, setSocket] = useState(io(API_ENDPOINT))
	const navigate = useNavigate();

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

	const randomlyGenerateAvatar = () => {
		let randomImageNumber = Math.floor(Math.random() * (192 - 181) + 181)
		const avatarBasePath = `/assets/The Nameless Terror Images/Portraits/image\ ${randomImageNumber}.png`
		return avatarBasePath
	}

	const onSubmitHandler = (routePath: string, e: React.FormEvent) => {
		e.preventDefault();
		const getAvatar = randomlyGenerateAvatar();

		gameMutation.mutate({
			name: userName,
			avatar: getAvatar
		});
		navigate(routePath)
	}

	const notify = (content: string) => toast(content);

	socket.on("message", data => notify(data))
	const joinExistingGame = (IdOfGame: string) => {
		let existingGameParams = {
			roomId: IdOfGame
		}
		socket.emit("join_room", existingGameParams);
		console.log(socket.id)
	}

	return (
		<>
			<div className={HomepageCSS["homepage-title-wrapper"]}>
				<img src={titleImg} className={HomepageCSS.titleImage} alt="The Nameless Terror" />
				<h5>A Lovecraftian Inspired Mafia Game</h5>
			</div>

			<div className={HomepageCSS["hostOrJoinBtns-wrapper"]}>
				<form className={HomepageCSS.form} onSubmit={(e) => onSubmitHandler('/lobby', e)}>
					<input name="name"
						className="user-selection-input"
						placeholder="Enter Name"
						onChange={e => setUserName(e.target.value)} />

					<GenericButton
						className={HomepageCSS["user-selection-input"]}
						type={"submit"}
						text={"Host Game"}
						style={
							{
								background: `url("${buttonImg}")`,
							}
						}
					/>
				</form>

				<GenericButton
					className={HomepageCSS["user-selection-input"]}
					text={"Join Game"}
					style={
						{
							background: `url("${buttonImg}")`,
						}
					}
					onClick={() => joinExistingGame(userName)}
				/>

			</div>
		</>
	);
}

export default Homepage;