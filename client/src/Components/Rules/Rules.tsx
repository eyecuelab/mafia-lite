import styles from "./Rules.module.css";
import questionMark from "../../assets/images/question_mark.png";
import { useModal } from "../../ModalContext";

const Rules = (): JSX.Element => {
	const { callModal } = useModal();

	return (
		<div className={styles.homepageFooter}>
			<p>HOW TO PLAY</p>
			<img src={questionMark} onClick={() => callModal(
				<div className={styles.modalContent}>
					<h2 className={styles.headerTwo}>HOW TO PLAY THE NAMELESS TERROR</h2>
					<p className={styles.paraContent}>The Nameless Terror is a &quot;hidden role&quot;, social deduction game where players must figure out who among them are secretly cultists trying to summon Cthulhu. (Similar to games like Mafia and Werewolf).</p>

					<p className={styles.paraContent}>When you start, the game will secretly and randomly choose a few players as Cultists, everyone else is an Investigator. You can see your assigned role in the top right corner of the game view. Investigators main goal during the game is to discover and eliminate Cultists. Cultists main goal is to sacrifice investigators to summon their dark god without being caught by the investigators.</p>

					<h3 className={styles.listHeader}>HOW TO PLAY A ROUND:</h3>
					<p className={styles.paraContent}>The Nameless Terror is played in rounds; rounds have a &quot;Day&quot; phase and a &quot;Night&quot; phase. Each round starts with a Day phase and ends with a Night phase. Each phase will end after the alloted time runs out, you can see the time remaining at the top of the game view.</p>

					<h3 className={styles.listHeader}>FIRST ROUND:</h3>
					<h4 className={styles.smallHeader}>DAY PHASE: Investigators & Cultists</h4>
					<p className={styles.paraContent}>During the day players can &quot;accuse&quot; other players of being a cultist by clicking on their player card in the game view. (Player cards are listed on the left side of the game view). Players can freely talk and change their votes during the Day phase. Whoever has the most votes at the end of the day phase will have their role revealed and will be either &quot;Jailed&quot; or &quot;Terminated&quot;. If the accused is NOT a cultist, they will be &quot;Jailed&quot; and unable to vote or participate in discussion until the END of the next day phase. If the accused is a cultist they are &quot;Terminated&quot; and eliminated from the game. If there is a tie, no one is jailed or terminated.</p>
					
					<h4 className={styles.smallHeader}>NIGHT PHASE: Investigators</h4>
					<p className={styles.paraContent}>Investigators have no specific actions they can take during the night phase, but all living players can use the &quot;All&quot; chat channel during any phase.</p>
					<h4 className={styles.smallHeader}>NIGHT PHASE: Cultist</h4>
					<p className={styles.paraContent}>During the night, cultists vote with other cultists on which investigator to sacrifice. They are free to discuss amongst themselves and change their votes just like during the day phase. Cultists will have other cultists marked with a red &quot;cultist badge&quot; on their player card. At the end of the phase, the player with the most votes is &quot;Murdered&quot; by the cultists and is eliminated from the game. In the case of a tie or if no vote is cast, Cthulhu will randomly pick a player to sacrifice. This INCLUDES cultists, if cultists can&apos;t reach a majority vote they might get eliminated themselves.</p>

					<h3 className={styles.listHeader}>THE FOLLOWING ROUND(s):</h3>
					<p className={styles.paraContent}>Eliminated players can still participate in the game as &quot;Ghosts&quot; and will still win or lose with their team.</p>

					<h4 className={styles.smallHeader}>NIGHT PHASE: Ghosts</h4>
					<p className={styles.paraContent}>Living players have the same rules as before, but Ghosts have special rules they play by. During the night each ghost is randomly assigned a cultist as a &quot;target&quot; and given a number of pictures to pick from. All players have three &quot;traits&quot; listed on their player card, as a ghost you need to pick an image that best signifies one or more of your target&apos;s traits. Be careful, as some traits are very similar to each other and can sometimes be shared with other players.</p>
					<p className={styles.paraContent}>Note that cultists also become ghosts as they die. They have the same abilities as other ghosts but instead of trying to communicate who the cultist(s) is/are, they try to frame investigators or just send confusing images to throw off the investigators.</p>

					<p className={styles.smallHeader}>NIGHT PHASE: Investigators & Cultists</p>
					<p className={styles.paraContent}>Same as the 1st round.</p>

					<h4 className={styles.smallHeader}>DAY PHASE: Investigators & Cultists</h4>
					<p className={styles.paraContent}>Starting with the second round, ghosts can send images to living players based on the traits of cultists. Players can look through all ghost images during the entire day phase. The day phase is otherwise the same as previously mentioned.</p>

					<p className={styles.smallHeader}>DAY PHASE: Ghosts</p>
					<p className={styles.paraContent}>Ghosts have no special actions they can take during the day phase, however, they are allowed to listen in on the living players discussion.</p>

					<h3 className={styles.smallHeader}>END OF THE GAME:</h3>
					<p className={styles.paraContent}>After the end of the first round, rounds will continue until either all cultists are eliminated or if at any point the investigators, excluding jailed players, don&apos;t outnumber the cultists.</p>
				</div>
			)} className={styles.questionMark} alt="question mark" />
		</div>
	);
};

export default Rules;