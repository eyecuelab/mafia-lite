import PlayerStatusOverlay from "../../Components/PlayerStatus/PlayerStatusOverlay";
import styles from "./Lobby.module.css";
import { Player } from "../../Types/Types";

type propTypes = {
	player: Player
	isMain?: boolean
	playerStatus?: string,
	isLobby: boolean
}

const terminatedStatusImage = "./src/assets/images/ui/image_180.png";
const jailedStatusImage = "./src/assets/images/ui/image_105.png";

const PlayerCard: React.FC<propTypes> = ({ player, isMain, playerStatus, isLobby }) => {
	const transitionAnimation = ` ${styles["player-card-entrance"]}`;

	/*
		Player Status should be contained in the game or player object on the backend, to be read anywhere the player exists.
		
		DISABLE in game lobby, once game starts. 9/1/22 Marcus
	*/

	return (
		<>
			<div className={(isMain) ? styles.mainPlayerCard : styles.playerCard + transitionAnimation}>
				<img className={(isMain) ? styles.mainPlayerCardImage : styles.playerCardImage} src={player?.avatar} alt="player avatar" />
				{!isLobby ? <PlayerStatusOverlay isMain={isMain ? true : false} playerStatus={player.status} /> : null}
				<div className={styles.playerDetails}>
					<p className={(isMain) ? styles.playerNameMain : styles.playerName}>{player?.name}</p>
					<p className={(isMain) ? styles.playerTraitsMain : styles.playerTraits}>Trait A, Trait B, Trait C</p>
					{/* {(player.status === "jailed") ? <img src={jailedStatusImage} className={styles.playerStatusOverlayImage}/> : null }
					{(player.status === "terminated") ? <img src={terminatedStatusImage} className={styles.playerStatusOverlayImage}/> : null } */}
				</div>
			</div>
		</>
	);
};
export default PlayerCard;