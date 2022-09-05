import { useQuery, useQueryClient } from "@tanstack/react-query";
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


type player = {
	id: number
	isHost: boolean
	name: string
	avatar: string
}
interface gameData {
	id: number
	players: Array<player>
	gameCode: string
	name: string
	size: number
}

interface CustomizedState {
	gameId: number
	playerId: number
	isHost: boolean
	lobbyName: string
}

const getGameData = async (gameId: number): Promise<gameData> => {
	const url = `${API_ENDPOINT}/game?id=${gameId}`;
	const response = await fetch(url, { ...BASE_HEADERS });
	return await handleResponse(response);
};

const getPlayerDetails = async (playerId: number): Promise<player> => {
	const url = `${API_ENDPOINT}/player/${playerId}`;
	const response = await fetch(url, { ...BASE_HEADERS });
	return await handleResponse(response);
};

const Lobby = (): JSX.Element => {
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
	let content =

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
		</div>;
	if (isLoading || playerLoading) content = <p> Loading ....</p>;
	return (
		<div>
			{content}
		</div >
	);
};

export default Lobby;