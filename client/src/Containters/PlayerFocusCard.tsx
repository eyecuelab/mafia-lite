import { useEffect, useState } from "react";
import styles from "./PlayerFocusCard.module.css";
import { Player } from "../Types/Types";
import murdered from "../assets/images/ui/image_104.png";
import jailed from "../assets/images/ui/image_105.png";
import terminated from "../assets/images/ui/image_180.png";


type propTypes = {
	player: Player
}

const PlayerFocusCard = (props: propTypes) => {
	const { player } = props;
	const [imgPath, setImgPath] = useState("");


	useEffect(() => {
		switch(player.status) {
			case "terminated": setImgPath(terminated); break;
			case "jailed": setImgPath(jailed); break;
			case "murdered": setImgPath(murdered); break;
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
