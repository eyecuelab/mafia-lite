import { useEffect, useState } from "react";
import io from "socket.io-client";
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../../ApiHelper";
import PlayerStatusOverlay from "../../Components/PlayerStatus/PlayerStatusOverlay";
import styles from "./Lobby.module.css";

type player = {
	id: number
	name: string
	avatar: string
}
type propTypes = {
	player: player
	isMain: boolean
}

const PlayerCard = (props: any) => {
	const [socket, setSocket] = useState(io(API_ENDPOINT));
	const { player, isMain, accusedPlayerStatus, jailedPlayer } = props;
	// const [voteCount, setVoteCount] = useState(io(API_ENDPOINT));
	const transitionAnimation = ` ${styles["player-card-entrance"]}`;

	/*
		Player Status should be contained in the game or player object on the backend, in future.
		For now we pass a hardcode string in the playerStatus prop below.
		DISABLE in game lobby, once game starts.
		TESTING is done in game lobby until day/night phase UI is built. 9/1/22 Marcus
	 */

	return (
		<>
			<div className={(isMain) ? styles.mainPlayerCard : styles.playerCard + transitionAnimation}>

				<img className={(isMain) ? styles.mainPlayerCardImage : styles.playerCardImage} src={player?.avatar} alt="player avatar" />
				{!isMain ? <PlayerStatusOverlay isMain={isMain} playerStatus={accusedPlayerStatus} /> : <PlayerStatusOverlay isMain={isMain} playerStatus={""} />}
				<div className={styles.playerDetails}>
					<p className={(isMain) ? styles.playerNameMain : styles.playerName}>{player?.name}</p>
					<p className={(isMain) ? styles.playerTraitsMain : styles.playerTraits}>Trait A, Trait B, Trait C</p>

				</div>
			</div>
		</>
	);
};

export default PlayerCard;