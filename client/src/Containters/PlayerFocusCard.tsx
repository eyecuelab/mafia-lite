import { useEffect, useState } from "react";
import styles from "./PlayerFocusCard.module.css";
import { Player } from "../Types/Types";

type propTypes = {
	player: Player
}

const terminatedStatusImage = "./src/assets/images/ui/image_180.png";
const jailedStatusImage = "./src/assets/images/ui/image_105.png";
const murderedStatusImage = "./src/assets/images/ui/image_104.png";

const PlayerFocusCard = (props: propTypes) => {
	const { player } = props;
	const [imgPath, setImgPath] = useState("");


	useEffect(() => {
		switch(player.status) {
			case "terminated": setImgPath(terminatedStatusImage); break;
			case "jailed": setImgPath(jailedStatusImage); break;
			case "murdered": setImgPath(murderedStatusImage); break;
			default: setImgPath("");
		}
	}, [player]);

	return (
		<div className={styles.playerFocusCardContainer}>
			<div className={styles.playerFocusAvatar}>
				<img src={player.avatar} className={styles.playerFocusImage} />
				<img src={imgPath} className={styles.playerFocusStatus} />
			</div>
			<div className={styles.playerFocusTextContainer}>
				<p className={styles.playerFocusName}>{player.name} has been {player.status}</p>
				<p className={styles.playerFocusDetails}>{player.team === "cultist" ? "You've eliminated a Cultist!" : `${player.name} is not a cultist`}</p>
			</div>
		</div>);
};

export default PlayerFocusCard;
