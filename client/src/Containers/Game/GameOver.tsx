import { Player } from "../../Types/Types";
import GameOverCSS from "./GameOver.module.css";
import { TitleImage } from "../../assets/images/Images";
import MenuButton from "../../Components/MenuButton";
import useGameStateQuery from "../../Hooks/GameDataHook";
import { useMutation } from "@tanstack/react-query";
import { postData } from "../../ApiHelper";
import { useModal } from "../../ModalContext";
import { useNavigate } from "react-router-dom";
import socket from "../../Hooks/WebsocketHook";

const gameLeave = async (payload: { gameId: number, id: number }) => postData("/game/end", payload); 

const GameOver = ({ cultistsWin,}: { winners: Player[]; cultistsWin: boolean; }) => {
	const { callModal } = useModal();
	const navigate = useNavigate();
	const {gameQueryIsLoading, gameQueryError, gameData} = useGameStateQuery();

	

	let backgroundImg = "";
	let winner = "";
	let paragraph = "";
	let paragraph2 = "";

	if (cultistsWin) {
		backgroundImg = "background-image-cultist";
		winner = "Cultist";
		paragraph = "The leader of the location organizes a militaristic group to hunt the creatures spawning all round us... but all is futile.";
		paragraph2 = "Panic and violence broke out as the cultists continue to bolster their numbers. This is not how it’s supposed to end...";
	} else {
		backgroundImg = "background-image-invest";
		winner = "Investigators";
		paragraph = "You’ve thwarted the plans of the last cultist. The city, unbeknownst to of its sleepy citizens, is safe once again."; 
		paragraph2 = "For a moment, you take a deep sigh of relief. But deep down inside you’ve always known that this is just the beginning...";
	}

	const onDoneClick = () => {
		if(gameData) {
			gameLeaveMutation.mutate({gameId: gameData?.game.id, id: gameData?.thisPlayer.id });
			navigate("/", {replace: true});
		}
	};

	const gameLeaveMutation = useMutation(gameLeave, {
		onSuccess: () => {
			console.log("Game is over");
			socket.emit("leave_game", gameData?.game.id);
		},
		onError: (error) => {
			if (error instanceof Error) {
				callModal(error.message);
			}
		}
	});
	
	if (gameQueryIsLoading) return <p>Loading ....</p>;

	if (gameQueryError instanceof Error) {
		callModal(gameQueryError.message);
	}

	return (
		<div className={GameOverCSS[`${backgroundImg}`]}>
			<img className={GameOverCSS["title-Img"]} src={TitleImage} />
			<div className={GameOverCSS["player-list-wrapper"]}>
				<h1 className={GameOverCSS["winner-header"]}>
					The {winner} Won...
				</h1>
				<p className={GameOverCSS["paragraph"]}>
					{paragraph}<br/>
					<br/>{paragraph2}
				</p>
				<MenuButton
					onClick={onDoneClick}
					className={GameOverCSS["Done-button"]}
					text={"Done"}
				/>
			</div>
		</div>
	);
};

export default GameOver;
