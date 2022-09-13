import { useMutation } from "@tanstack/react-query";
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
import questionMark from "../../assets/images/question_mark.png";
import { useModal } from "../../ModalContext";
//import io, { Socket } from "socket.io-client";
import useGameStateQuery from "../../Hooks/GameDataHook";
import socket from "../../Hooks/WebsocketHook";

const CLIENT_ENDPOINT = import.meta.env.VITE_CLIENT_ENDPOINT;
const startNewGame = async (newGame: { gameId: number }) => postData("/start", newGame); 

//const socket: Socket = io(API_ENDPOINT);

const Lobby = (): JSX.Element => {
	const { callModal } = useModal();
	const navigate = useNavigate();

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

		return () => { socket.off("game_start"); };
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
				<img src={titleImg} className={styles.titleImage} alt="The Nameless Terror" />
				<h1 className={styles.lobbyName}>{gameData?.game?.name}</h1>
				<div className={styles.lobbyContainer}>
					{(gameData) ? <div className={styles.playerStatus}>
						<SubTitle title={"Your Character"} />
						<PlayerCard player={gameData.thisPlayer} isMain={true} isLobby={true} />
						<div className={styles.gameCodeInput}>
							<p>Your game code: {gameData.game.gameCode}</p>
							<button className={styles.copyButton} onClick={() => copyToClipBoard(gameData.game.gameCode)}>{(codeIsCopied) ? "Copied" : "Copy"} </button>
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
							</div> : null}
					</div> : null}
					<div className={styles.otherPlayers}>
						<SubTitle title={"JOINING GAME"} />
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