import React from "react";
import { Player } from "../../../Types/Types";
import styles from "../Lobby.module.css";
import { useModal } from "../../../ModalContext";
import { useMutation } from "@tanstack/react-query";
import { postData } from "../../../ApiHelper";


type propTypes = {
	player: Player
}

const playerIsReady = async (payload: {id: number, isReady: boolean}) => postData("/readyPlayer", payload);

const LobbyPlayerCard: React.FC<propTypes> = ({ player }) => {
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

	const getCardStyle = () => {
		let style = `${styles.playerCard} ${styles["player-card-entrance"]}`;
		if (player.isReady) {
			style += " " + styles.playerCardLobbyReady;
		}

		return style;
	};

	
	return (
		<React.Fragment>
			<div className={ getCardStyle() }>
				<img className={styles.playerCardImage} src={player.avatar} alt="player avatar" />
				<div className={styles.playerDetails}>
					<p className={styles.playerName}>{player.isHost && <span className={styles.hostIcon}>&#9812;</span>}{player.name}</p>
					{player.isReady && <p>Player is Ready</p>}
					<p className={styles.playerTraits}>{formatter.format(player.traits)}</p>
				</div>
			</div>
		</React.Fragment>
	);
};

export default LobbyPlayerCard;