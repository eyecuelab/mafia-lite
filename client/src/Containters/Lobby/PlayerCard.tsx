import styles from "./Lobby.module.css";

type player = {
	id: number
	name: string
	avatar: string
}
type propTypes = {
	player: player,
  isMain: boolean
}
const PlayerCard = (props: propTypes) => {
	const {player, isMain } = props;
	return (
		<div className={(isMain) ? styles.mainPlayerCard : styles.playerCard}>
			<img className={(isMain) ? styles.mainPlayerCardImage : styles.playerCardImage} src={player?.avatar} alt="player avatar" />
			<div className={styles.playerDetails}>
				<p className={(isMain) ? styles.playerNameMain : styles.playerName}>{player?.name}</p>
				<p className={(isMain) ? styles.playerTraitsMain : styles.playerTraits}>Trait A, Trait B, Trait C</p>
			</div>
		</div>
	);
};

export default PlayerCard;