import styles from "./ShortRules.module.css";
import questionMark from "../../assets/images/question_mark.png";
import { useModal } from "../../ModalContext";
import { useState } from "react";
import ShortRulesDayNight from "./ShortRulesDayNight";
import { TerminatedBadge, JailedBadge, MurderedBadge } from "../../assets/images/Images";

const ShortRules = ({playerTeam, playerStatus} : {playerTeam  : string | undefined, playerStatus: string | undefined} ) : JSX.Element => {
	const { callModal } = useModal();
	const isUndefined = playerStatus === undefined || playerStatus === undefined;
	const isCultist = (!isUndefined && playerTeam === "cultist") ? true : undefined;
	const isGhost = (!isUndefined &&  playerStatus === "murdered" || playerStatus === "terminated") ? true : undefined;

	return (
		<div className={styles.homepageFooter}>
			<p onClick={() => callModal(
				<div className={styles.modalContent}>
					<h3 className={styles.headerTwo}>Quick Guide</h3>
					<div className={styles.yourPlayerDetailsContainer}>
						<p className={styles.playerStatusDetail}><span className={styles.playerStatusDetailSpan}>Your team : </span>{playerTeam?.toUpperCase()}</p>
						<p className={styles.playerStatusDetail}><span className={styles.playerStatusDetailSpan}>Your status : </span> {playerStatus?.toUpperCase()}</p>
					</div>
					<h3 className={styles.listHeader}>Roles</h3>
					<ul className={styles.infoList}>
						<li className={(isCultist && !isGhost) ? styles.isPlayer : styles.notPlayer}><span className={styles.cultistSpan}>Cultist</span> : Your goal is to eliminate all investigators and to not get caught doing so.</li>
						<li className={(!isCultist && !isGhost) ? styles.isPlayer : styles.notPlayer}><span className={styles.investigatorSpan}>Investigator</span> : Your goal is to eliminate all cultists using clues provided by ghosts</li>
						<li className={(isGhost) ? styles.isPlayer : styles.notPlayer}><span className={styles.ghostSpan}>Ghost</span> : A dead investigator/cultist, provide images as clues based on your targets personality traits or choose chaos...</li>
					</ul>
					<h3 className={styles.listHeader}>Statuses</h3>
					<ul className={styles.infoList}>
						<li className={(playerStatus === "terminated") ? styles.playerFlexLI : styles.noPlayerFlexLI}><img src={TerminatedBadge} className={styles.imageSpan} /> : A cultist accused and killed by investigators during the day.</li>
						<li className={(playerStatus === "jailed") ? styles.playerFlexLI : styles.noPlayerFlexLI}><img src={JailedBadge} className={styles.imageSpan}/> : An investigator that was accused of being a cultist. Duration : One Round.</li>
						<li className={(playerStatus === "murdered") ? styles.playerFlexLI : styles.noPlayerFlexLI}><img src={MurderedBadge} className={styles.imageSpan} /> : A killed investigator or cultist. Cultists can be murdered by Cthulhu.</li>
					</ul>
					<h3 className={styles.listHeader}>At Day/Night</h3>
					<ShortRulesDayNight playerStatus={playerStatus} playerTeam={playerTeam} />
					<h3 className={styles.listHeader}>How to win</h3>
					<ul className={styles.infoList}>
						<li className={(isCultist) ? styles.isPlayer : styles.notPlayer}><span className={styles.cultistSpan}>Cultists</span> : Same number of investigators as cultists</li>
						<li className={(!isCultist) ? styles.isPlayer : styles.notPlayer}><span className={styles.investigatorSpan}>Investigators</span> : Terminate all the cultists</li>
					</ul>
				</div>
			)} className={styles.questionMark}>Quick Guide</p>
		</div>
	);
};

export default ShortRules;