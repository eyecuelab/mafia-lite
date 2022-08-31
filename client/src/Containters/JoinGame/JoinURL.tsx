import { useParams, useNavigate } from "react-router-dom";
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../../ApiHelper";
import { useQuery } from '@tanstack/react-query';
import titleImg from "../../assets/The Nameless Terror Images/Title.png";
import styles from "./JoinGame.module.css";

interface Game {
	id: number
}

const getGameId = async (gameCode: string | undefined): Promise<Game> => {
	const url = `${API_ENDPOINT}/game?code=${gameCode ? gameCode : ""}`;
	const response = await fetch(url, { ...BASE_HEADERS, method: "GET" });
	return await handleResponse(response);
}

function JoinURL(): JSX.Element {
	const { code } = useParams();
	const { error, data: game } = useQuery(["game"], () => getGameId(code));

	const navigate = useNavigate();

	if (error instanceof Error) {
		return <p>An error has occurred: {error.message}</p>
	}

	if (game) {
		navigate("/newplayer", { state: { gameId: game.id, isHost: false }, replace: true });
	}

	return (
		<>
			<div className={styles["join-game-title-wrapper"]}>
				<img src={titleImg} className={styles.titleImage} alt="The Nameless Terror" />
				<h5 className={  styles["header"]}>A Lovecraftian Inspired Mafia Game</h5>
			</div>
			<p>...joining game</p>
		</>
	)
}

export default JoinURL;