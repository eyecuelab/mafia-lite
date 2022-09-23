import React, { useState } from "react";
import styles from "./HoverStatus.module.css";
import { MurderBadge, AccuseBadge } from "../../../assets/images/Images";
import useGameStateQuery from "../../../Hooks/GameDataHook";
import { useModal } from "../../../ModalContext";

type PropTypes = {
	selected: boolean
	team: string
	hasResult: boolean
};

const HoverStatus: React.FC<PropTypes> = ({ selected, team, hasResult }) => {
	const { gameQueryError, gameData } = useGameStateQuery();
	const { callModal } = useModal();

	const [ renderBadge, setRenderBadge ] = useState(false);

	if (gameQueryError instanceof Error) {
		callModal(gameQueryError.message);
	}

	const isDay = gameData?.currentRound?.currentPhase === "day";
	const isAlive = gameData?.thisPlayer.status === "alive";
	const canHover = (isDay || (gameData?.thisPlayer.team === "cultist" && team !== "cultist")) && isAlive && !hasResult;
	const hoverBadge = isDay ? AccuseBadge : MurderBadge;

	return (
		<React.Fragment>
			<div className={styles["player-status-overlay"]} onMouseEnter={() => setRenderBadge(true)} onMouseLeave={() => setRenderBadge(false)}>
				{(renderBadge || selected) && canHover && <img className={styles["player-card-badge"]} src={hoverBadge} alt={"Player Status Badge"} />}
			</div>
		</React.Fragment>
	);
};

export default HoverStatus;