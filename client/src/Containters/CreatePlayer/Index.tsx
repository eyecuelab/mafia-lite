import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { postData } from "../../ApiHelper";
import { useLocation } from "react-router-dom";
import titleImg from "../../assets/images/Title.png";
import CreatePlayerCSS from "./CreatePlayer.module.css";
import GenericButton from "../../Components/GenericButton";
import MenuButton from "../../Components/MenuButton";
import { useModal } from "../../ModalContext";

type PlayerCreateInput = {
	gameId: number,
	isHost: boolean,
	name: string
}

interface locationState {
	gameId: number,
	isHost: boolean
}

const createPlayer = async (playerInput: PlayerCreateInput) => postData("/player", playerInput);

function CreatePlayer() {
	const { callModal } = useModal();
	const location = useLocation();
	const state = location.state as locationState;
	const { gameId, isHost } = state;

	const navigate = useNavigate();
	const [name, setName] = useState("");
	
	const playerMutation = useMutation(createPlayer, {
		onSuccess: () => {
			navigate("/lobby");
		},
		onError: (error) => {
			if (error instanceof Error) {
				callModal(`Oops! ${error.message}`);
			}
		}
	});

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!name) {
			callModal("Please enter a character name");
			return;
		}

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
			<GenericButton
				onClick={()=> {
					(isHost) ? navigate("/newgame") : navigate("/join");
				}} 
				className={CreatePlayerCSS["cancel-join-btn"]}  
				text={"BACK"}
			/>
		</>
	);
}

export default CreatePlayer;