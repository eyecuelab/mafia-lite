import PlayerStatusOverlay from "../../Components/PlayerStatus/PlayerStatusOverlay";
import styles from "./Lobby.module.css";
import { Player } from "../../Types/Types";

type propTypes = {
	player: Player
	isMain: boolean
	playerStatus?: string
}

const PlayerCard: React.FC<propTypes> = ({ player, isMain, playerStatus }) => {
	const transitionAnimation = ` ${styles["player-card-entrance"]}`;

	/*
		Player Status should be contained in the game or player object on the backend, to be read anywhere the player exists.
		
		DISABLE in game lobby, once game starts. 9/1/22 Marcus
	*/

	return (
		<>
			<div className={(isMain) ? styles.mainPlayerCard : styles.playerCard + transitionAnimation}>
				<img className={(isMain) ? styles.mainPlayerCardImage : styles.playerCardImage} src={player?.avatar} alt="player avatar" />
				<PlayerStatusOverlay isMain={isMain} playerStatus={playerStatus ? playerStatus : "alive"} />
				<div className={styles.playerDetails}>
					<p className={(isMain) ? styles.playerNameMain : styles.playerName}>{player?.name}</p>
					<p className={(isMain) ? styles.playerTraitsMain : styles.playerTraits}>Trait A, Trait B, Trait C</p>
				</div>
			</div>
		</>
	);
};
export default PlayerCard;