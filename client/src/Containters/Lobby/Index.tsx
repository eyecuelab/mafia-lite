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
import questionMark from "../../assets/images/question_mark.png";
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

		socket.on("player_joined_lobby", () => {
			queryClient.invalidateQueries(["games"]);
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
							</div> : null}
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
			<div className={styles.homepageFooter}>
				<p>HOW TO PLAY</p>
				<img src={questionMark} onClick={() => callModal(
					<div className={styles.modalContent}>
						<h2 className={styles.headerTwo}>How to play The Nameless Terror</h2>
						<h4>First Night:</h4> 
						<ul>
							<li className={styles.listHeader}>The game begins and there will be a Cultists icon designating who is a Cultist that only Cultist can see. The Cultists will immediately forced to kill an Investigator. A majority decision has to be made for an Investigator to be killed. If there is no majority decision, a random player will be killed</li>
						</ul>
						<h4>First Day:</h4>
						<ul>
							<li className={styles.listHeader}>The first day round begins! You must just start accusing people out of nowhere. Who is acting shyer than usual?</li> 
							<li className={styles.listHeader}>Who is talking a bit too much?</li> 
							<li className={styles.listHeader}>Ask straight-forward questions about identities.</li> 
							<li className={styles.listHeader}>Look people directly in the eye and ask them if they are a Cultist.</li> 
							<li className={styles.listHeader}>Once an accusation to kill is made, someone must second it for the player to be seriously considered a cultists. </li>
							<li className={styles.listHeader}>If you have two solid nominations, all players then vote to kill, majority wins.</li> 
							<li className={styles.listHeader}>You can have as many nominations as you want, but you need a majority to kill.</li> 
							<li className={styles.listHeader}>When an Investigator is nominated and receives a majority they are jailed rather than killed and they cannot participate til the following round. Investigators are unable to be killed by the Cultists while jailed. If a Cultist is nominated and receives a majority they are killed and are able to participate as a Ghost.</li>
						</ul> 
						<h4>Second Night:</h4> 
						<ul>
							<li className={styles.listHeader}>All players eyes are closed and the narrator awakens the cultists and asks who they want to kill. She then awakens the doctor for the first time and asks who they want to save. And then, she awakens the detective and asks who they want to know about.</li>
						</ul>
						<h4>Third Day:</h4> 
						<ul>
							<li className={styles.listHeader}> The game continues in these phases, day and night, day and night, until investigators kill all cultists members or cultists outnumber investigators.</li>
						</ul>
						{/* <p>THE SECOND GAME</p>

							<li>Once you are killed from the game, you are then allowed to see the identities of all players at night. You will be shocked to see who has been fooling you and will bond will the other players who have been killed. It is almost just as thrilling to watch the game take place—knowing all the identities—as it is to be alive playing. You will talk about it on your walk home and perhaps the next day. That epic game of Mafia you played where you tricked your closest friends and family into thinking you were on their side and then betrayed them for the win.</li> */}
					</div>
				)} className={styles.questionMark} alt="The Nameless Terror" />
			</div>
		</div >
	);
};

export default Lobby;