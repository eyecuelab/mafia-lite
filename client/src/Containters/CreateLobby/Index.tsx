import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../../ApiHelper";
import { useMutation } from "@tanstack/react-query";
import titleImg from "../../assets/The Nameless Terror Images/Title.png";
import CreateLobbyCSS from "./CreateLobby.module.css";
import GenericButton from "../../Components/GenericButton";
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
};

function CreateLobby() {
	const { callModal } = useModal();
	const [lobbyName, setLobbyName] = useState("");
	const [lobbySize, setLobbySize] = useState(0);
	const navigate = useNavigate();
	const gameMutation = useMutation(createGame, {
		onSuccess: (data) => {
			navigate("/newplayer", { state: { gameId: data.id, isHost: true }, replace: true });
		},
		onError: (error) => {
			if (error instanceof Error) {
				alert(`Oops! ${error.message}`);
			}
		}
	});

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const errors = [];

		if (!lobbyName) {
			errors.push("Needs a lobby name!");
		}
		if (!lobbySize) {
			errors.push("Needs a lobby size!");
		}

		if (errors.length) {
			callModal((
				<ul>
					{errors.map((error) => <li key={error}>{error}</li>)}
				</ul>
			));
			return;
		}

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
						required 
						name="name" 
						placeholder="Enter game name" 
						onChange={e => setLobbyName(e.target.value)} />
					<select
						className={CreateLobbyCSS["drop-selection-input"]}  
						onChange={e => setLobbySize(parseInt(e.target.value))}>
						<option value="default">Select player count</option>
						<option value="4">4</option>
						<option value="5">5</option>
						<option value="6">6</option>
						<option value="7">7</option>
						<option value="8">8</option>
						<option value="9">9</option>
						<option value="10">10</option>
						<option value="11">11</option>
						<option value="12">12</option>
					</select>
					<MenuButton
						className={CreateLobbyCSS["create-game-btn"]}  
						text={"CONTINUE"}
					/>
				</form>
			</div>
			<GenericButton
				link = "/"
				className={CreateLobbyCSS["cancel-game-btn"]}  
				text={"CANCEL"}
			/>
		</>
	);
}

export default CreateLobby;