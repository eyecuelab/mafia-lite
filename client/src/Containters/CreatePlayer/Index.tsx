import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../../ApiHelper";
import { useLocation } from 'react-router-dom';
import titleImg from "../../assets/The Nameless Terror Images/Title.png";
import CreatePlayerCSS from './CreatePlayer.module.css';
import MenuButton from "../../Components/MenuButton";

type PlayerCreateInput = {
	gameId: number,
	isHost: boolean,
	name: string
}

interface locationState {
	gameId: number,
	isHost: boolean,
	lobbyName: string
	playerId: number
}

const createPlayer = async (playerInput: PlayerCreateInput) => {
	const url = `${API_ENDPOINT}/player`;
	const response = await fetch(url, { ...BASE_HEADERS, method: "POST", body: JSON.stringify(playerInput) });	
	return await handleResponse(response);
}

function CreatePlayer() {
	const location = useLocation();
	const state = location.state as locationState;
	const { gameId, lobbyName, isHost } = state;

	const navigate = useNavigate();
	const [name, setName] = useState("");
	
	const playerMutation = useMutation(createPlayer, {
    onSuccess: (data) => {
		console.log(data)
      navigate("/lobby", { state: { gameId: gameId, lobbyName: lobbyName, playerId: data.id }, replace: true });
    },
    onError: (error) => {
      if (error instanceof Error) {
        alert(`Oops! ${error.message}`);
      }
    }
  });

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		playerMutation.mutate({
			gameId: gameId,
			isHost: isHost,
			name: name
		});
	};

	return (
		<>
			<div className={CreatePlayerCSS["join-game-title-wrapper"]}>
				<img src={titleImg} className={CreatePlayerCSS.titleImage} alt="The Nameless Terror" />
				<h5 className={CreatePlayerCSS["header"]}>A Lovecraftian Inspired Mafia Game</h5>
			</div>
			<form onSubmit={onSubmit}>
				<input
				className={CreatePlayerCSS["user-selection-input"]} 
				name="name" 
				placeholder="Enter Character Name" 
				onChange={e => setName(e.target.value)} 
				/>
				<MenuButton
					className={CreatePlayerCSS["continue-game-btn"]}
					text={"Continue"}
				/>
			</form>
			<MenuButton
				onClick={()=> {
					(isHost) ? navigate("/newgame") : navigate("/joingame")
				}} 
				className={CreatePlayerCSS["cancel-join-btn"]}  
				text={"BACK"}
			/>
		</>
	);
}

export default CreatePlayer;