import Rules from "../../Components/Rules/Rules";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../../ApiHelper";
import { TitleImage } from "../../assets/images/Images";
import GenericButton from "../../Components/GenericButton";
import MenuButton from "../../Components/MenuButton";
import SubTitle from "../../Components/Titles/SubTitle";
import styles from "./Lobby.module.css";
import { useModal } from "../../ModalContext";
import useGameStateQuery from "../../Hooks/GameDataHook";
import socket from "../../Hooks/WebsocketHook";
import LobbyPlayerList from "./LobbyPlayerList";
import MainPlayerCard from "./MainPlayerCard";
import LobbyChat from "../../Components/Chat/LobbyChat";
import { connectToRoom, hangUpAllCalls, setRoomId, hangUpCall, setPlayerId, setHandleError } from "../../Voice/voice";
import { Player } from "../../Types/Types";

const startNewGame = async (newGame: { gameId: number }) => postData("/start", newGame);
const playerLeave = async (payload: { gameId: number, id: number }) => postData("/game/leave", payload);

const Lobby = (): JSX.Element => {
	const { callModal } = useModal();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { gameQueryIsLoading, gameQueryError, gameData } = useGameStateQuery();

	const [ codeIsCopied, setCodeIsCopied ] = useState(false);
	const [ linkIsCopied, setLinkIsCopied ] = useState(false);
	const [ showCallButton, setShowCallButton ] = useState(true);

	const gameId = useRef(-1);

	const getAllOtherPlayerIds = (players: Player[], thisPlayerId: number) => {
		const playerIds: number[] = [];
		players.forEach((player) => {
			if (player.id !== thisPlayerId) {
				playerIds.push(player.id);
			}
		});

		return playerIds;
	};

	const callEntireLobby = (players: Player[], thisPlayerId: number) => {
		const playerIds = getAllOtherPlayerIds(players, thisPlayerId);
		if (playerIds.length > 0) {
			connectToRoom(playerIds);
		}
	};

	useEffect(() => {
		if (gameData && gameData.game.id !== gameId.current) {
			gameId.current = gameData.game.id;
			socket.emit("join", gameData.game.id, gameData.thisPlayer.id);
			setRoomId(gameData.game.id);
			setPlayerId(gameData.thisPlayer.id);
		}
	}, [gameData, gameData?.game.id]);

	useEffect(() => {
		setHandleError((error: Error) => {
			callModal(error.message);
		});

		socket.on("game_start", () => {
			navigate("/game");
		});

		socket.on("player_left", (playerId: number) => {
			hangUpCall(playerId);
			if(playerId === gameData?.thisPlayer.id) {
				navigate("/", {replace: true, state: {isKicked : true}});
			} else {
				queryClient.invalidateQueries(["games"]);
			}
		});

		socket.on("playerIsReady", () => {
			queryClient.invalidateQueries(["games"]);
		});

		socket.on("player_joined_lobby", () => {
			queryClient.invalidateQueries(["games"]);
		});

		return () => {
			socket.off("playerIsReady");
			socket.off("player_joined_lobby");
			socket.off("game_start");
			socket.off("player_left");
		};
	}, []);
	
	const copyToClipBoard = (gameCode: string) => {
		navigator.clipboard.writeText(gameCode);
		setCodeIsCopied(true);
		setTimeout(() => setCodeIsCopied(false), 600);
	};

	const onLeaveGameButtonClick = () => {
		if(gameData) {
			playerLeaveMutation.mutate({gameId: gameData?.game.id, id: gameData?.thisPlayer.id });
			navigate("/", {replace : true});
		}
	};

	const playerLeaveMutation = useMutation(playerLeave, {
		onSuccess: () => {
			console.log("player");
		},
		onError: (error) => {
			if (error instanceof Error) {
				callModal(error.message);
			}
		}	
	});

	const copyLinkToClipBoard = (gameCode: string) => {
		navigator.clipboard.writeText(`${window.location.origin}/join/${gameCode}`);
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
				<img src={TitleImage} className={styles.logoImage} alt="The Nameless Terror" />
				<h1 className={styles.lobbyName}>{gameData?.game?.name}</h1>
				{gameData && <LobbyChat sender={gameData?.thisPlayer}/>}
				<div className={styles.lobbyContainer}>
					{(gameData) ? <div className={styles.playerStatus}>
						<SubTitle title={"Your Character"} />
						<MainPlayerCard player={gameData?.thisPlayer} />
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
									onClick={onLeaveGameButtonClick}
									className={styles["start-game-btn"]}
									text={"LEAVE GAME"}
								/>
							</div>}
					</div> : null}
					<div className={styles.otherPlayers}>
						<SubTitle title={"JOINING GAME"} />
						<h3 className={styles.playerCount}>Player Count: {gameData?.players.length}</h3>
						<LobbyPlayerList />
					</div>
				</div>
			</div>
			{gameData && <div>
				{showCallButton ?
					<button onClick={() => {
						setShowCallButton(false);
						callEntireLobby(gameData.players, gameData.thisPlayer.id);
					}}>Open Call</button>
					:
					<button onClick={() => {
						setShowCallButton(true);
						hangUpAllCalls();
					}}>Close Call</button>}
			</div>}
			<Rules />
		</div >
	);
};
export default Lobby;