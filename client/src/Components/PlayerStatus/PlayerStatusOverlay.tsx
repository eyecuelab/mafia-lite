import styles from "./PlayerStatusOverlay.module.css";
import { useState, useEffect } from "react";
import murdered from "../../assets/images/ui/image_104.png";
import accused from "../../assets/images/ui/image_35.png";
import jailed from "../../assets/images/ui/image_105.png";
import terminated from "../../assets/images/ui/image_180.png";
import murder from "../../assets/images/ui/image_51.png";

const arrayOfImages = [
	murdered,
	accused,
	jailed,
	terminated,
	murder
];

const getBadgeImage = (status: string | undefined) => {
	switch (status) {
		case "murdered":
			return arrayOfImages[0];
		case "accused":
			return arrayOfImages[1];
		case "jailed":
			return arrayOfImages[2];
		case "terminated":
			return arrayOfImages[3];
		case "murder":
			return arrayOfImages[4];
		default:
			return "";
	}
};

const PlayerStatusOverlay = ({ playerStatus, isMain, phase, canVote }: { playerStatus: string | undefined, isMain: boolean | null, phase: string | undefined, canVote: boolean }) => {
	const [ renderBadge, setRenderBadge ] = useState(false);
	const [ badgeImagePath, setBadgeImagePath ] = useState(getBadgeImage(playerStatus));

	useEffect(() => {
		setBadgeImagePath(getBadgeImage(playerStatus));
	}, [playerStatus]);

	const cursorHovering = (entered: boolean) => {
		if(canVote) {
			if (!playerStatus || playerStatus === "alive") {
				console.log(playerStatus);
				if (entered) {
					setRenderBadge(true);
					(phase === "day") ? setBadgeImagePath(getBadgeImage("accused")) : setBadgeImagePath(getBadgeImage("murder"));
				} else {
					setRenderBadge(false);
				}
			}
		}
	};

	const cardStyle = isMain ? styles["main-player-status-overlay"] : styles["player-status-overlay"];
	const imageStyle = isMain ? styles["main-player-card-badge"] : styles["player-card-badge"];

	return (
		<div className={cardStyle} onMouseEnter={() => cursorHovering(true)} onMouseLeave={() => cursorHovering(false)}>
			{renderBadge || playerStatus !== "alive" ? <img className={imageStyle} src={badgeImagePath} alt={"Player Status Badge"} /> : null}
		</div>
	);
};

export default PlayerStatusOverlay;