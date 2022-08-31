import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../../ApiHelper";
import SubTitle from "../../Components/Titles/SubTitle";
// import GenericButton from '../GenericButton';
// import List, { listItem } from "../List";
import styles from "./Lobby.module.css";
import PlayerCard from './PlayerCard';
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

interface Game {
	name: string
	gameId: number,
	playerId: number
	lobbyName: string
}
const getGameData = async (gameId: number): Promise<gameData> => {
	const url = `${API_ENDPOINT}/game/${gameId}`;
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
	const queryClient = useQueryClient();
	const { gameId, playerId } = state;

	const { isLoading: playerLoading, error: playerError, data: playerData } = useQuery(["players"], () => getPlayerDetails(playerId));
	const { isLoading, error, data } = useQuery(["game"], () => getGameData(gameId));
	const [socket, setSocket] = useState(io(API_ENDPOINT));
	const [lobbyEntered, setLobbyEntered] = useState(false);
	const [gameStarted, setGameStarted] = useState(false);
	const [playersInGame, setPlayersInGame] = useState([]);
	const [codeIsCopied, setCodeIsCopied] = useState(false);

	useEffect(() => {
		//Establish connection when component mounts
		socket.on('connect', () => {
			console.log(`socket connected`)
			socket.on(`disconnect`, () => console.log(`socket disconnected`))
		})

		return (() => {
			socket.off('connect');
		})
	}, [])

	//Perform logic on backend and receive players in game data from backend
	socket.on("get_players_in_room", (PLAYERS_IN_ROOM) => setPlayersInGame(PLAYERS_IN_ROOM))


	//Use placeholder to pass data obj through to server later
	const userAndRoomDataPlaceholder = {
		players: playersInGame, //To contain all users active in room
		roomId: gameId, //Placeholder for Game ID
		socketId: socket.id
	};
	const copyToClipBoard = () => {
		const gameCode = data?.gameCode
		if (gameCode !== undefined) {
			navigator.clipboard.writeText(gameCode);
			setCodeIsCopied(true)
			setTimeout(() => setCodeIsCopied(false), 600)
		}
	}

	// //Start the actual game
	// const gameStartSwitch = () => {
	// 	if (!gameStarted) {
	// 		console.log(`gameStartSwitch`, userAndRoomDataPlaceholder)
	// 		socket.emit("new_game_clicked", userAndRoomDataPlaceholder);
	// 	}
	// 	setGameStarted(!gameStarted)
	// }

	const players = data?.players.filter((player) => {
		return player.id !== playerId
	})
	let content =
		<div className={styles.lobbyPageContainer}>
			<h1 className={styles.lobbyName}>{data?.name}</h1>
			<div className={styles.lobbyContainer}>
				<div className={styles.playerStatus}>
					<SubTitle title={"Your Character"} />
					{(playerData) ? <PlayerCard player={playerData} isMain={true} /> : null}
					<div className={styles.gameCodeInput}>
						<p>Your game code: {data?.gameCode}</p>
						<button onClick={() => copyToClipBoard()}>{(codeIsCopied) ? "Copied" : "Copy"} </button>
					</div>
					{(playerData?.isHost) ?
						<div className={styles.hostButtonGroup}>
							<button>Start Game</button>
							<button>Cancel Game</button>
						</div> : null}
				</div>
				<div className={styles.otherPlayers}>
					<SubTitle title={"Other Players"} />
					{(players) ? <PlayerList players={players} /> : null}
				</div>
			</div>
		</div>
	if (isLoading || playerLoading) content = <p> Loading ....</p>
	return (
		<div>
			{content}
		</div >
	);
};

export default Lobby;