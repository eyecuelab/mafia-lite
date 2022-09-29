import { useState } from "react";
import styles from "./ShortRules.module.css";

const ShortRulesDayNight = ({playerTeam, playerStatus} : {playerTeam  : string | undefined, playerStatus: string | undefined}) => {
	const [isShowingDayInfo, setIsShowingDayInfo] = useState(true);
	const isUndefined = playerStatus === undefined || playerStatus === undefined;
	const isCultist = (!isUndefined && playerTeam === "cultist") ? true : undefined;
	const isGhost = (!isUndefined &&  playerStatus === "murdered" || playerStatus === "terminated") ? true : undefined;
	const handleNightButtonClick = () => {
		console.log("clicked");
		setIsShowingDayInfo(false);
	};
	const handleDayButtonClick = () => {
		console.log("clicked");
		setIsShowingDayInfo(true);
	};
	return (
		<div>
			<div className={styles.buttonGroup}>
				<button onClick={handleDayButtonClick} className={styles.timeLogoDay}>&#9788;</button>
				<button onClick={handleNightButtonClick} className={styles.timeLogoNight}>&#x263E;</button>
			</div>
			<div className={styles.timeDiv}>
				<div className={(!isShowingDayInfo) ? styles.timeInfoContainerDaySmall : styles.timeInfoContainerDay}>
					<div>
						<ul className={(!isShowingDayInfo) ? styles.infoListTimeSmall : styles.infoListTime}>
							<li className={(isCultist && !isGhost) ? styles.isPlayerDark : styles.notPlayerDark}><span className={styles.cultistSpan}>Cultist</span> : Do not get voted for or you will be terminated. Try to throw off the investigators.</li>
							<li className={(!isCultist && !isGhost) ? styles.isPlayerDark : styles.notPlayerDark}><span className={styles.investigatorSpan}>Investigator</span> : Use your image clues provided by the ghosts to try and vote out a cultist.</li>
							<li className={(isGhost) ? styles.isPlayerDark: styles.notPlayerDark}><span className={styles.ghostSpan}>Ghost</span> : You can no longer vote, just watch and pray the investigators understand your clue.</li>
						</ul>
					</div> 
				</div> 
				<div className={(isShowingDayInfo) ? styles.timeInfoContainerNightSmall : styles.timeInfoContainerNight}>
					<div>
						<ul className={(isShowingDayInfo) ? styles.infoListTimeSmall : styles.infoListTime}>
							<li className={(isCultist && !isGhost) ? styles.isPlayer : styles.notPlayer}><span className={styles.cultistSpan}>Cultist</span> : Vote to murder an investigator. but DO NOT end in a tie...</li>
							<li className={(!isCultist && !isGhost) ? styles.isPlayer : styles.notPlayer}><span className={styles.investigatorSpan}>Investigator</span> : Hope you are not the next victim.</li>
							<li className={(isGhost) ? styles.isPlayer : styles.notPlayer}><span className={styles.ghostSpan}>Ghost</span> : Select an image the best reflects your target&apos;s personality traits or don&apos;t</li>
						</ul>
					</div> 
				</div>
			</div>
		</div>
	);
};
export default ShortRulesDayNight;