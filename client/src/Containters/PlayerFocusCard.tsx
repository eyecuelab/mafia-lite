import styles from "./PlayerFocusCard.module.css";
import { Player } from "../Types/Types";

type player = {
	id: number
	name: string
	avatar: string
    status: string
}
type propTypes = {
	player: player
}
const terminatedStatusImage = "./src/assets/images/ui/image_180.png";
const jailedStatusImage = "./src/assets/images/ui/image_105.png";
const PlayerFocusCard = (props: propTypes) => {
	const { player } = props;
    const isTerminated = player.status === "terminated";
	return (
    <div className={styles.playerFocusCardContainer}>
        <div className={styles.playerFocusAvatar}>
            <img src={player.avatar} className={styles.playerFocusImage} />
            {isTerminated ? <img src={terminatedStatusImage} className={styles.playerFocusStatus}/> 
            : <img src={jailedStatusImage} className={styles.playerFocusStatus}/>}
        </div>
        <div className={styles.playerFocusTextContainer}>
            <p className={styles.playerFocusName}>{player.name} has been {player.status}</p>
            <p className={styles.playerFocusDetails}>{player.status === "jailed" ? `${player.name} is not a cultist` : "You've eliminated a Cultist!"}</p>
        </div>
    </div>);
};

export default PlayerFocusCard;
