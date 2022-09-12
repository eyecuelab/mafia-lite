import styles from "./PlayerFocusCard.module.css";

type player = {
	id: number
	name: string
	avatar: string
    status: string
}
type propTypes = {
	player: player
}

const PlayerFocusCard = (props: propTypes) => {
	const { player } = props;
	return (
    <div className={styles.playerFocusCardContainer}>
        <img src={player.avatar} className={styles.playerFocusImage}/>
        <p className={styles.playerFocusStatus}>{player.status}</p>
        <p className={styles.playerFocusName}>{player.name} is selected</p>
    </div>);
};
export default PlayerFocusCard;