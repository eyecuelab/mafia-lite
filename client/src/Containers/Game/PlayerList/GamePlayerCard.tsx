import React from "react";
import { Player } from "../../../Types/Types";
import styles from "../../Lobby/Lobby.module.css";
import StatusStyles from "./HoverStatus.module.css";
import { CultistBadge, MurderedBadge, JailedBadge, TerminatedBadge } from "../../../assets/images/Images";
import { useModal } from "../../../ModalContext";
import useGameStateQuery from "../../../Hooks/GameDataHook";
import HoverStatus from "./HoverStatus";

type PropTypes = {
	player: Player
	selected: boolean
	hasResult: boolean
}

const getBadgeImage = (status: string | undefined) => {
	switch (status) {
		case "murdered":
			return MurderedBadge;
		case "jailed":
			return JailedBadge;
		case "terminated":
			return TerminatedBadge;
		default:
			return "";
	}
};

const GamePlayerCard: React.FC<PropTypes> = ({ player, selected, hasResult }) => {
	const { gameQueryError, gameData } = useGameStateQuery();
	const { callModal } = useModal();
	const formatter = new Intl.ListFormat("en", { style: "long", type: "unit" });

	if (gameQueryError instanceof Error) {
		callModal(gameQueryError.message);
	}

	const showCultistBadge = (player.team === "cultist") && (gameData?.thisPlayer.team === "cultist");
	const showStatus = player.status !== "alive";
	const isThisPlayer = player.id === gameData?.thisPlayer.id;

	const getCardStyle = () => {
		let style = `${styles.playerCard} ${styles["player-card-entrance"]}`;
		if (isThisPlayer) {
			style += " " + styles.yourPlayerBorder;
		}

		return style;
	};

	return (
		<React.Fragment>
			<div className={ getCardStyle() }>
				{ player.isDisconnected && <div className={styles.disconnectedOverlay}><h3>Disconnected</h3></div>}
				<img className={styles.playerCardImage} src={player.avatar} alt="player avatar" />
				{showCultistBadge && <img src={CultistBadge} className={styles.cultistBadge} alt="cultist badge" />}
				<div className={StatusStyles["player-status-overlay"]}>
					{showStatus ?
						<img className={StatusStyles["player-card-badge"]} src={getBadgeImage(player.status)} alt={"Player Status Badge"} />
						:
						!isThisPlayer && <HoverStatus selected={selected} team={player.team ?? "investigator"} hasResult={hasResult} />
					}
				</div>
				<div className={styles.playerDetails}>
					<p className={styles.playerName}>{player.isHost && <span className={styles.hostIcon}>&#9812;</span>}{player.name}</p>
					<p className={styles.playerTraits}>{formatter.format(player.traits)}</p>
				</div>
			</div>
		</React.Fragment>
	);
};

export default GamePlayerCard;

