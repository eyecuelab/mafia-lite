import { useEffect, useState } from "react";
import styles from "./PlayerFocusCard.module.css";
import { Player } from "../Types/Types";
import { MurderedBadge, JailedBadge, TerminatedBadge } from "../assets/images/Images";

type propTypes = {
	player: Player | undefined
	tie?: boolean
	nightTie?:boolean
}

const PlayerFocusCard = (props: propTypes) => {
	const { player, nightTie, tie } = props;
	const [imgPath, setImgPath] = useState("");


	useEffect(() => {
		switch(player?.status) {
			case "terminated": setImgPath(TerminatedBadge); break;
			case "jailed": setImgPath(JailedBadge); break;
			case "murdered": setImgPath(MurderedBadge); break;
			default: setImgPath("");
		}
	}, [player]);

	return (
		<div className={styles.playerFocusCardContainer}>
			{(tie) ? 
				<div className={styles.playerFocusTextContainer}>
					<p className={styles.playerFocusDetails}>Tie.</p>
					<p className={styles.playerFocusSubDetail}>No one was jailed.</p>
				</div> 
				: 
				<div className={styles.playerFocusCardContainer}>
					<div className={styles.playerFocusAvatar}>
						<img src={player?.avatar} className={styles.playerFocusImage} />
						<img src={imgPath} className={styles.playerFocusStatus} />
					</div>
					<div className={styles.playerFocusTextContainer}>
						{(nightTie) ? 
							<div>
								<p className={styles.playerFocusName}>{player?.name} has been randomly {player?.status} by Cthulhu</p> 
								<p className={styles.playerFocusDetails}>{player?.team === "cultist" ? "Cthulhu killed a Cultist!" : "Cthulhu killed an Investigator!"}</p>
							</div>
							: 
							<div>
								<p className={styles.playerFocusName}>{player?.name} has been {player?.status}</p>
								<p className={styles.playerFocusDetails}>{player?.team === "cultist" ? "You've eliminated a Cultist!" : `${player?.name} is not a cultist`}</p>
							</div>
						}
					</div>
				</div>
			}
		
		</div>);
};

export default PlayerFocusCard;
