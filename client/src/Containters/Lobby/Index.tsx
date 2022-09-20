import Rules from "../../Components/Rules/Rules";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../../ApiHelper";
import titleImg from "../../assets/images/Title.png";
import GenericButton from "../../Components/GenericButton";
import MenuButton from "../../Components/MenuButton";
import SubTitle from "../../Components/Titles/SubTitle";
import styles from "./Lobby.module.css";
import PlayerCard from "./PlayerCard";
import PlayerList from "./PlayerList";
import { useModal } from "../../ModalContext";
import useGameStateQuery from "../../Hooks/GameDataHook";
import socket from "../../Hooks/WebsocketHook";

const CLIENT_ENDPOINT = import.meta.env.VITE_CLIENT_ENDPOINT;
const startNewGame = async (newGame: { gameId: number }) => postData("/start", newGame); 

const Lobby = (): JSX.Element => {
	const { callModal } = useModal();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { gameQueryIsLoading, gameQueryError, gameData } = useGameStateQuery();

	const [codeIsCopied, setCodeIsCopied] = useState(false);
	const [linkIsCopied, setLinkIsCopied] = useState(false);

	useEffect(() => {
		if (gameData) {
			socket.emit("join", gameData.game.id);
		}
	}, [gameData?.game.id]);

	useEffect(() => {
		socket.on("game_start", () => {
			navigate("/game");
		});

		socket.on("playerIsReady", () => {
			console.log("Recieved Server Message");
			queryClient.invalidateQueries(["games"]);
		});

		socket.on("player_joined_lobby", () => {
			queryClient.invalidateQueries(["games"]);
		});

		return () => { socket.off("game_start"); socket.off("playerIsReady"); };
	});
	const copyToClipBoard = (gameCode: string) => {
		navigator.clipboard.writeText(gameCode);
		setCodeIsCopied(true);
		setTimeout(() => setCodeIsCopied(false), 600);
	};

	const copyLinkToClipBoard = (gameCode: string) => {
		navigator.clipboard.writeText(`${CLIENT_ENDPOINT}/join/${gameCode}`);
		setLinkIsCopied(true);
		setTimeout(() => setLinkIsCopied(false), 600);
	};

	const newGameMutation = useMutation(startNewGame, {
		onSuccess: () => {
			socket.emit("start_new_game");
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
		<div>
			<div className={styles.lobbyPageContainer}>
				<img src={titleImg} className={styles.logoImage} alt="The Nameless Terror" />
				<h1 className={styles.lobbyName}>{gameData?.game?.name}</h1>
				<div className={styles.lobbyContainer}>
					{(gameData) ? <div className={styles.playerStatus}>
						<SubTitle title={"Your Character"} />
						<PlayerCard player={gameData.thisPlayer} isMain={true} isLobby={true} canVote={false} />
						<div className={styles.gameCodeInput}>
							<p>Your game code: {gameData.game.gameCode}</p>
							<button className={styles.copyButton} onClick={() => copyToClipBoard(gameData.game.gameCode)}>{(codeIsCopied) ? "Copied" : "Copy Code"} </button>
							<button className={styles.copyButton} onClick={() => copyLinkToClipBoard(gameData.game.gameCode)}>{(linkIsCopied) ? "Copied Link" : "Copy Link"} </button>
						</div>
						{(gameData.thisPlayer.isHost) ?
							<div className={styles.hostButtonGroup}>
								<MenuButton
									onClick={() => { newGameMutation.mutate({ gameId: gameData.game.id }); }}
									className={styles["start-game-btn"]}
									text={"START GAME"}
								/>
								<GenericButton
									onClick={() => (navigate("/newgame"))}
									className={styles["cancel-game-btn"]}
									text={"CANCEL GAME"}
								/>
							</div> : 
							<div>
								<MenuButton
									onClick={() => console.log("Leaving game")}
									className={styles["start-game-btn"]}
									text={"LEAVE GAME"}
								/>
							</div>}
					</div> : null}
					<div className={styles.otherPlayers}>
						<SubTitle title={"JOINING GAME"} />
						<h3 className={styles.playerCount}>Player Count: {gameData?.players.length}</h3>
						{!!(gameData?.players.length) && 
						<PlayerList 
							players={
								gameData.players.filter((player) => {
									return player.id !== gameData.thisPlayer.id;
								})
							}
							isLobby={true} 
						/>}
					</div>
				</div>
			</div>
			<Rules />
		</div >
	);
};

export default Lobby;