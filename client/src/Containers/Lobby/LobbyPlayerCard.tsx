import React, { useState } from "react";
import { Player } from "../../Types/Types";
import styles from "./Lobby.module.css";
import { useModal } from "../../ModalContext";
import { useMutation } from "@tanstack/react-query";
import { postData } from "../../ApiHelper";


type propTypes = {
	player: Player
	thisPlayer: Player
}
const playerLeave = async (payload: { gameId: number, id: number }) => postData("/game/leave", payload); 

const LobbyPlayerCard: React.FC<propTypes> = ({ player, thisPlayer }) => {
	const { callModal } = useModal();
	const formatter = new Intl.ListFormat("en", { style: "long", type: "unit" });
	const [hoverKick, setHoverKick] = useState(false);
	const kickPlayer = () => {
		if(player.gameId) {
			playerLeaveMutation.mutate({gameId: player.gameId, id: player.id });
		}
	};
	const playerLeaveMutation = useMutation(playerLeave, {
		onSuccess: () => {
			console.log("player kicked");
		},
		onError: (error) => {
			if (error instanceof Error) {
				console.log(error);
				callModal(error.message);
			}
		}	
	});

	const getCardStyle = () => {
		let style = `${styles.lobbyPlayerCard} ${styles["player-card-entrance"]}`;
		if (player.isReady) {
			style += " " + styles.playerCardLobbyReady;
		}

		return style;
	};

	
	return (
		<div className={styles.cardControlContainer}>
			{thisPlayer.isHost && 
			<button onClick={kickPlayer} 
				onMouseEnter={() => setHoverKick(true)} 
				onMouseLeave={() => setHoverKick(false)} 
				className={styles.kickButton}
			>&#10006;
			</button>}
			<div className={ getCardStyle() }>
				<img className={styles.playerCardImage} src={player.avatar} alt="player avatar" />
				<div className={styles.playerDetails}>
					<p className={styles.playerName}>{player.isHost && <span className={styles.hostIcon}>&#9812;</span>}{player.name}</p>
					{player.isReady && <p className={styles.readyPlayerText}>Player is Ready</p>}
					{hoverKick && <p className={styles.kickPlayerText}>Kick player</p>}
					<p className={styles.playerTraits}>{formatter.format(player.traits)}</p>
				</div>
			</div>
		</div>
	);
};

export default LobbyPlayerCard;