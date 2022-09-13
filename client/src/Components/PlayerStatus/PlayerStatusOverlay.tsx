import styles from "./PlayerStatusOverlay.module.css";
import { useState, useEffect } from "react";

const arrayOfImages = [
	"assets/images/ui/image_104.png",
	"assets/images/ui/image_35.png",
	"assets/images/ui/image_105.png",
	"assets/images/ui/image_180.png"
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
	default:
		return "";
	}
};

const PlayerStatusOverlay = ({ playerStatus, isMain }: { playerStatus: string | undefined, isMain: boolean | null }) => {
	const [ renderBadge, setRenderBadge ] = useState(false);
	const [ badgeImagePath, setBadgeImagePath ] = useState(getBadgeImage(playerStatus));

	useEffect(() => {
		setBadgeImagePath(getBadgeImage(playerStatus));
	}, [playerStatus]);

	const cursorHovering = (entered: boolean) => {
		if (!playerStatus || playerStatus === "alive") {
			console.log(playerStatus);
			if (entered) {
				setRenderBadge(true);
				setBadgeImagePath(getBadgeImage("accused"));
			} else {
				setRenderBadge(false);
			}
		}
		
	};

	const cardStyle = isMain ? styles["main-player-status-overlay"] : styles["player-status-overlay"];
	const imageStyle = isMain ? styles["main-player-card-badge"] : styles["player-card-badge"];

	return (
		<div className={cardStyle} onMouseEnter={() => cursorHovering(true)} onMouseLeave={() => cursorHovering(false)}>
			{renderBadge || playerStatus !== "alive" ? <img className={imageStyle} src={`./src/${badgeImagePath}`} alt={"Player Status Badge"} /> : null}
		</div>
	);
};

export default PlayerStatusOverlay;