import React from "react";
import { Player } from "../../Types/Types";
import styles from "./Lobby.module.css";
import { useModal } from "../../ModalContext";
import { useMutation } from "@tanstack/react-query";
import { postData } from "../../ApiHelper";

type propTypes = {
	player: Player
}

const playerIsReady = async (payload: {id: number, isReady: boolean}) => postData("/readyPlayer", payload);

const MainPlayerCard: React.FC<propTypes> = ({ player }) => {
	const { callModal } = useModal();
	const formatter = new Intl.ListFormat("en", { style: "long", type: "unit" });

	const readyPlayer = useMutation(playerIsReady, {
		onSuccess: (player: Player) => {
			console.log("updated player", player);
		},
		onError: (error) => {
			if (error instanceof Error) {
				callModal(error.message);
			}
		}
	});

	const onReadyButtonClick = () => {
		readyPlayer.mutate({ id: player.id, isReady: !player.isReady });
	};
	
	return (
		<React.Fragment>
			<div className={ `${styles.mainPlayerCard} ${styles["player-card-entrance"]}` }>
				<img className={player.isReady ? styles.mainPlayerCardImageReady : styles.mainPlayerCardImage} src={player.avatar} alt="player avatar" />
				<div className={styles.playerDetails}>
					<p className={styles.playerNameMain}>{player.isHost && <span className={styles.hostIcon}>&#9812;</span>}{player.name}</p>
					<p className={styles.playerTraits}>{formatter.format(player.traits)}</p>
				</div>
				<button className={styles.readyButtonMain} onClick={onReadyButtonClick}>{
					player.isReady ? 
						<span>&#10003;</span>
						: 
						<span>Ready</span>}
				</button>
			</div>
		</React.Fragment>
	);
};

export default MainPlayerCard;