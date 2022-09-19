import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getData } from "../../ApiHelper";
import { TitleImage } from "../../assets/images/Images";
import JoinGameCSS from "./JoinGame.module.css";
import MenuButton from "../../Components/MenuButton";
import GenericButton from "../../Components/GenericButton";
import { useModal } from "../../ModalContext";

const getGameId = async (gameCode: string) => getData(`/game?code=${gameCode}`);

function JoinGame() {
	const { callModal } = useModal();
	const [gameCode, setGameCode] = useState("");
	const navigate = useNavigate();

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!gameCode) {
			callModal("Please enter a game code");
			return;
		} else if (gameCode.length !== 4) {
			callModal("Please enter a valid game code length");
			return;
		}
		try {
			const game = await getGameId(gameCode);
			navigate("/newplayer", { state: { gameId: game.id, isHost: false }, replace: true });
		} catch (error) {
			if (error instanceof Error) {
				callModal(error.message);
			}
		}
	};

	return (
		<>
			<div className={JoinGameCSS["join-game-title-wrapper"]}>
				<img src={TitleImage} className={JoinGameCSS.titleImage} alt="The Nameless Terror" />
				<h5 className={JoinGameCSS["header"]}>A Lovecraftian Inspired Mafia Game</h5>
			</div>
			<div>
				<form onSubmit={onSubmit}>
					<input
						className={JoinGameCSS["user-selection-input"]}
						name="gameCode"
						placeholder="Enter game code"
						onChange={e => setGameCode(e.target.value)} />

					<MenuButton
						className={JoinGameCSS["continue-game-btn"]}
						text={"CONTINUE"}
					/>
				</form >
			</div >
			<GenericButton
				link="/"
				className={JoinGameCSS["cancel-join-btn"]}
				text={"CANCEL"}
			/>
		</>
	);
}

export default JoinGame;