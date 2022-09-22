import PlayerStatusOverlay from "../../Components/PlayerStatus/PlayerStatusOverlay";
import styles from "./Lobby.module.css";
import { Player } from "../../Types/Types";
import cultistBadge from "../../assets/images/ui/Cultist_Badge.png";
import { postData } from "../../ApiHelper";
import { useModal } from "../../ModalContext";
import { useMutation } from "@tanstack/react-query";

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

const playerIsReady = async (payload: {id: number, isReady: boolean}) => postData("/readyPlayer", payload); 
const PlayerCard: React.FC<propTypes> = ({ player, playerStatus, isMain, isLobby, team, canVote, phase, isPlayer}) => {
	const transitionAnimation = ` ${styles["player-card-entrance"]}`;
	const { callModal } = useModal();

	const readyPlayer = useMutation(playerIsReady, {
		onSuccess: (player: any) => {
			console.log("updated player", player);
		},
		onError: (error) => {
			if (error instanceof Error) {
				callModal(error.message);
			}
		}
	});

	const onReadyButtonClick = (e: any) => {
		// e.target.disabled = true;
		readyPlayer.mutate({id: player.id, isReady: !player.isReady});
	};
	
	return (
		<>
			<div className={(isMain) ? styles.mainPlayerCard : (isLobby && player.isReady) ? styles.playerCardLobbyReady + transitionAnimation: (isPlayer) ? styles.yourPlayerBorder + transitionAnimation : styles.playerCard + transitionAnimation}>
				<img className={(isMain) ? (player.isReady) ? styles.mainPlayerCardImageReady : styles.mainPlayerCardImage : styles.playerCardImage} src={player?.avatar} alt="player avatar" />
				{(team === "cultist" && player.team === "cultist")? <img src={cultistBadge} className={styles.cultistBadge} /> : null}
				{!isLobby ? <PlayerStatusOverlay isMain={isMain ? true : false} playerStatus={playerStatus} canVote={canVote} phase={phase} /> : null}
				<div className={styles.playerDetails}>
					<p className={(isMain) ? styles.playerNameMain : styles.playerName}>{(player.isHost) ? <span className={styles.hostIcon}>&#9812;</span> : null}{player?.name}</p>
					{(player.isReady && !isMain && isLobby) ? <p>Player is Ready</p> : null}
					<p className={(isMain) ? styles.playerTraitsMain : styles.playerTraits}>
						{player.traits.map((trait, index, array) => index === array.length - 1 ? trait : `${trait},`)}
					</p>
				</div>
			</div>
			<div>
				{isMain && !player.isReady ? <button className={styles.readyButtonMain} onClick={onReadyButtonClick}>Ready</button> : null}
				{isMain && player.isReady ? <button className={styles.readyButtonMain} onClick={onReadyButtonClick}>&#10003;</button> : null}
			</div>
		</>
	);
};
export default PlayerCard;