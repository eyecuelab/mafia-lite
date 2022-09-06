import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../../ApiHelper";
import titleImg from "../../assets/The Nameless Terror Images/Title.png";
import GenericButton from "../../Components/GenericButton";
import MenuButton from "../../Components/MenuButton";
import SubTitle from "../../Components/Titles/SubTitle";
import styles from "./Lobby.module.css";
import PlayerCard from "./PlayerCard";
import PlayerList from "./PlayerList";
import { useModal } from "../../ModalContext";

type NewGamePayload = {
	gameId: number
}

type Player = {
	id: number
	isHost: boolean
	name: string
	avatar: string
}

interface GameData {
	id: number
	players: Array<Player>
	gameCode: string
	name: string
	size: number
}

interface CustomizedState {
	gameId: number
	playerId: number
}

const getGameData = async (gameId: number) : Promise<GameData> => {
	const url = `${API_ENDPOINT}/game?id=${gameId}`;
	const response = await fetch(url, { ...BASE_HEADERS });
	return await handleResponse(response);
};

const getPlayerDetails = async (id: number): Promise<Player> => {
	const url = `${API_ENDPOINT}/player?id=${id}`;
	const response = await fetch(url, { ...BASE_HEADERS , method: "GET" });
	return await handleResponse(response);
};

const startNewGame = async (newGame: NewGamePayload) => {
	const url = `${API_ENDPOINT}/start`;
	const response = await fetch(url, { ...BASE_HEADERS , method: "POST", body: JSON.stringify(newGame) });
	return await handleResponse(response);
};

const Lobby = (): JSX.Element => {
	const { callModal } = useModal();
	const location = useLocation();
	const state = location.state as CustomizedState;
	const { gameId, playerId } = state;

	const { isLoading: playerLoading, error: playerError, data: playerData } = useQuery(["players"], () => getPlayerDetails(playerId));
	const { isLoading, error, data } = useQuery(["game"], () => getGameData(gameId));
	const [socket, setSocket] = useState(io(API_ENDPOINT));

	const [playersInGame, setPlayersInGame] = useState([]);
	const [codeIsCopied, setCodeIsCopied] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		//Establish connection when component mounts
		socket.on("connect", () => {
			console.log("socket connected");
			socket.on("disconnect", () => console.log("socket disconnected"));
		});
		return (() => {
			socket.off("connect"); //disconnect
		});
	}, []);

	//Perform logic on backend and receive players in game data from backend
	socket.on("get_players_in_room", (PLAYERS_IN_ROOM) => setPlayersInGame(PLAYERS_IN_ROOM));

	const copyToClipBoard = () => {
		const gameCode = data?.gameCode;
		if (gameCode !== undefined) {
			navigator.clipboard.writeText(gameCode);
			setCodeIsCopied(true);
			setTimeout(() => setCodeIsCopied(false), 600);
		}
	};

	const players = data?.players.filter((player) => {
		return player.id !== playerId;
	});

	const newGameMutation = useMutation(startNewGame, {
		onSuccess: () => {
			navigate("/game", { state: { gameId: gameId }, replace: true });
		},
		onError: (error) => {
			if (error instanceof Error) {
				console.log("TEST " + error);
				callModal(error.message);
			}
		}
	});

	const newGameData: NewGamePayload = { gameId: gameId }; 

	if (isLoading || playerLoading) return (<p> Loading ....</p>);

	return (
		<div>
			<div className={styles.lobbyPageContainer}>
				<img src={titleImg} className={styles.titleImage} alt="The Nameless Terror" />
				<h1 className={styles.lobbyName}>{data?.name}</h1>
				<div className={styles.lobbyContainer}>
					<div className={styles.playerStatus}>
						<SubTitle title={"Your Character"} />
						{(playerData) ? <PlayerCard player={playerData} isMain={true} /> : null}
						<div className={styles.gameCodeInput}>
							<p>Your game code: {data?.gameCode}</p>
							<button className={styles.copyButton} onClick={() => copyToClipBoard()}>{(codeIsCopied) ? "Copied" : "Copy"} </button>
						</div>
						{(playerData?.isHost) ?
							<div className={styles.hostButtonGroup}>
								<MenuButton
									onClick={() => newGameMutation.mutate( newGameData )}
									className={styles["start-game-btn"]}
									text={"START GAME"}
								/>
								<GenericButton
									onClick={() => (navigate("/newgame"))}
									className={styles["cancel-game-btn"]}
									text={"CANCEL GAME"}
								/>
							</div> : null}
					</div>
					<div className={styles.otherPlayers}>
						<SubTitle title={"JOINING GAME"} />
						{(players) ? <PlayerList players={players} /> : null}
					</div>
				</div>
			</div>
		</div >
	);
};

export default Lobby;