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
import questionMark from "../../assets/The Nameless Terror Images/questionMark.png";
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
			<div className={styles.homepageFooter}>
				<p>HOW TO PLAY</p>
				<img src={questionMark} onClick={() => callModal(
					<div><h2>How to play The Nameless Terror</h2>
						<ul>
							<li>First Night:</li> 
							<ul>
								<li>The narrator begins at night by telling all players to close their eyes. “Mafia, wake up. See your fellow members,” she says. “Mafia, go to sleep.” In the first round, this is all that happens.</li>
							</ul>
							<li>First Day:</li>
							<ul>
								<li>Everyone opens their eyes and the games begin. You must just start accusing people out of nowhere. Who is acting shyer than usual?</li> 
								<li>Who is talking a bit too much?</li> 
								<li>Ask straight-forward questions about identities.</li> 
								<li>Look people directly in the eye and ask them if they are in the mafia.</li> 
								<li>Once a nomination to kill is made, someone must second it for the player to be seriously considered in the mafia. </li>
								<li>If you have two solid nominations, all players then vote to kill, majority wins.</li> 
								<li>You can have as many nominations as you want, but you need a majority to kill.</li> 
								<li>When a player is killed, they are no longer allowed to speak and their identity is not revealed.</li>
							</ul> 
							<li>Second Night:</li> 
							<ul>
								<li>All players eyes are closed and the narrator awakens the mafia and asks who they want to kill. She then awakens the doctor for the first time and asks who they want to save. And then, she awakens the detective and asks who they want to know about.</li>
							</ul>
							

							<li>Third Day:</li> 
							<ul>
								<li>The narrator awakens all players and someone has been killed, unless the doctor has figured out who the mafia had their sights on and saved this player. The game continues in these phases, day and night, day and night, until civilians kill all mafia members or mafia outnumber civilians.</li>
							</ul>
							

							{/* <p>THE SECOND GAME</p>

							<li>Once you are killed from the game, you are then allowed to see the identities of all players at night. You will be shocked to see who has been fooling you and will bond will the other players who have been killed. It is almost just as thrilling to watch the game take place—knowing all the identities—as it is to be alive playing. You will talk about it on your walk home and perhaps the next day. That epic game of Mafia you played where you tricked your closest friends and family into thinking you were on their side and then betrayed them for the win.</li> */}

						</ul>
					</div>
				)} className={styles.questionMark} alt="The Nameless Terror" />
			</div>
		</div >
	);
};

export default Lobby;