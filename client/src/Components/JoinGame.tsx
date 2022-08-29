import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from "socket.io-client";
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../ApiHelper";
import titleImg from "../assets/The Nameless Terror Images/Title.png";
import buttonImg from "../assets/The Nameless Terror Images/UI/image\ 15.png";
import GenericButton from './GenericButton';
import JoinGameCSS from './JoinGame.module.css';

type JoinGamePayload = {
	gameCode: string
}

const joinGame = async (joinGamePayload: JoinGamePayload) => {
	const url = `${API_ENDPOINT}/game/join`;
	const response = await fetch(url, { ...BASE_HEADERS, method: "POST", body: JSON.stringify(joinGamePayload) });
	return await handleResponse(response);
}

function JoinGame() {
	const [gameCode, setGameCode] = useState("");
	const navigate = useNavigate();

	const joinGameMutation = useMutation(joinGame, {
		onSuccess: (data) => {
			navigate("/newplayer", { state: { gameId: data.game.id, isHost: false }, replace: true });
		},
		onError: (error) => {
			if (error instanceof Error) {
				alert(`Oops! ${error.message}`);
			}
		}
	});

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault(); 
		await joinGameMutation.mutateAsync({
			gameCode: gameCode
		})
	}

	return (
		<>
			<div className={JoinGameCSS		 ["join-game-title-wrapper"]}>
				<img src={titleImg} className={JoinGameCSS.titleImage} alt="The Nameless Terror" />
				<h5 className={JoinGameCSS["header"]}>A Lovecraftian Inspired Mafia Game</h5>
			</div>
			<div>
				<form onSubmit={onSubmit}>
					<input 
					className={JoinGameCSS["user-selection-input"]}
					name="gameCode" 
					placeholder="Enter game ID" 
					onChange={e => setGameCode(e.target.value)} />
					<GenericButton
						className={JoinGameCSS["continue-game-btn"]} 
						type={"submit"}
						text={"CONTINUE"}
						style={
							{
								backgroundImage: `url("${buttonImg}")`
							}
						}
					/>
				</form>
			</div>
		</>
	);
}

export default JoinGame;