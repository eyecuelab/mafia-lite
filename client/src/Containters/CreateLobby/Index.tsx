import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../../ApiHelper";
import { useMutation } from '@tanstack/react-query';
import titleImg from "../../assets/The Nameless Terror Images/Title.png";
import CreateLobbyCSS from './CreateLobby.module.css';
import MenuButton from "../../Components/MenuButton";

type GameCreatePayload = {
	name: string,
	size: number
}

interface Game extends GameCreatePayload {
	id: string;
	createdAt: string;
	endedAt?: string;
}

const createGame = async (gameInput: GameCreatePayload) => {
	const url = `${API_ENDPOINT}/game`;
	const response = await fetch(url, { ...BASE_HEADERS, method: "POST", body: JSON.stringify(gameInput) });
	return await handleResponse(response);
}

function CreateLobby() {
	const [lobbyName, setLobbyName] = useState("");
	const [lobbySize, setLobbySize] = useState(1);
	const navigate = useNavigate();
	const gameMutation = useMutation(createGame, {
    onSuccess: (data) => {
      navigate("/newplayer", { state: { gameId: data.game.id, isHost: true }, replace: true });			
    },
    onError: (error) => {
      if (error instanceof Error) {
        alert(`Oops! ${error.message}`);
      }
    }
  });

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		gameMutation.mutate({
			name: lobbyName,
			size: lobbySize
		});
	};

	return (
		<>
		<div className={CreateLobbyCSS["create-lobby-title-wrapper"]}>
			<img src={titleImg} className={CreateLobbyCSS.titleImage} alt="The Nameless Terror" />
			<h5>A Lovecraftian Inspired Mafia Game</h5>
		</div>
			<div>
				<form onSubmit={onSubmit}>
					<input
						className={CreateLobbyCSS["user-selection-input"]} 
						name="name" 
						placeholder="Enter game name" 
						onChange={e => setLobbyName(e.target.value)} />
					<input
						className={CreateLobbyCSS["user-selection-input"]}  
						name="size" 
						placeholder="Choose player count" 
						type={"number"} 
						onChange={e => setLobbySize(parseInt(e.target.value))} />
					<MenuButton
						className={CreateLobbyCSS["create-game-btn"]}  
						text={"CONTINUE"}
					/>
				</form>
			</div>
			<MenuButton
				link = "/"
				className={CreateLobbyCSS["cancel-game-btn"]}  
				text={"CANCEL"}
			/>
		</>
	);
}

export default CreateLobby;