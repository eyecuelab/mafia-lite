import styles from "./PlayerFocusCard.module.css";
import { Player } from "../Types/Types";

const PlayerFocusCard = ({ player }: { player: Player }) => {
	return (
		<div className={styles.playerFocusCardContainer}>
			<img src={player.avatar} className={styles.playerFocusImage}/>
			<div className={styles.playerFocusCardBody}>
				<p className={styles.playerFocusName}>{player.name} has been {player.status}</p>
				<p className={styles.playerFocusStatus}>{player.status === "jailed" ? `${player.name} is not a cultist` : "You've eliminated a Cultist!"}</p>
			</div>
		</div>);
};

export default PlayerFocusCard;

//styles.playerFocusName