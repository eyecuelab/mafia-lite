import PlayerStatusOverlay from "../../Components/PlayerStatus/PlayerStatusOverlay";
import styles from "./Lobby.module.css";
import { Player } from "../../Types/Types";
import { CultistBadge } from "../../assets/images/Images";

type propTypes = {
	player: Player
	playerStatus?: string
	isMain?: boolean
	isLobby: boolean
	team?: string
	canVote: boolean
	phase?: string
	isPlayer? : boolean
}

const PlayerCard: React.FC<propTypes> = ({ player, playerStatus, isMain, isLobby, team, canVote, phase, isPlayer}) => {
	const transitionAnimation = ` ${styles["player-card-entrance"]}`;

	/*
		Player Status should be contained in the game or player object on the backend, to be read anywhere the player exists.
		
		DISABLE in game lobby, once game starts. 9/1/22 Marcus

		styles.playerCard + transitionAnimation
	*/

	return (
		<>
			<div className={(isMain) ? styles.mainPlayerCard : (isPlayer) ? styles.yourPlayerBorder + transitionAnimation : styles.playerCard + transitionAnimation}>
				<img className={(isMain) ? styles.mainPlayerCardImage : styles.playerCardImage} src={player?.avatar} alt="player avatar" />
				{(team === "cultist" && player.team === "cultist")? <img src={CultistBadge} className={styles.cultistBadge} /> : null}
				{!isLobby ? <PlayerStatusOverlay isMain={isMain ? true : false} playerStatus={playerStatus} canVote={canVote} phase={phase} /> : null}
				<div className={styles.playerDetails}>
					<p className={(isMain) ? styles.playerNameMain : styles.playerName}>{player?.name}</p>
					<p className={(isMain) ? styles.playerTraitsMain : styles.playerTraits}>
						{player.traits.map((trait, index, array) => index === array.length - 1 ? trait : `${trait},`)}
					</p>
				</div>
			</div>
		</>
	);
};
export default PlayerCard;