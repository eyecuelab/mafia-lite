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
					<h4 className={styles.smallHeader}>FIRST DAY:</h4>
					<ul>
						<li className={styles.listHeader}>The game begins with the first day round! You must just start accusing people out of nowhere. Who is acting shyer than usual?</li> 
						<li className={styles.listHeader}>Who is talking a bit too much?</li> 
						<li className={styles.listHeader}>Ask straight-forward questions about identities.</li> 
						<li className={styles.listHeader}>Look people directly in the eye and ask them if they are a Cultist.</li> 
						<li className={styles.listHeader}>Once an accusation to kill is made, someone must second it for the player to be seriously considered a cultists. </li>
						<li className={styles.listHeader}>If you have two solid nominations, all players then vote to kill, majority wins.</li> 
						<li className={styles.listHeader}>You can have as many nominations as you want, but you need a majority to kill.</li> 
						<li className={styles.listHeader}>When an Investigator is nominated and receives a majority they are jailed rather than killed and they cannot participate til the following round. Investigators are unable to be killed by the Cultists while jailed. If a Cultist is nominated and receives a majority they are killed and are able to participate as a Ghost.</li>
					</ul>
					<h4 className={styles.smallHeader}>FIRST NIGHT:</h4> 
					<ul>
						<li className={styles.listHeader}>There will be a Cultists icon designating who is a Cultist that only Cultists can see throughout the whole game. The Cultists will begin to decide on who should be killed. A majority decision has to be made for an Investigator to be killed.</li> 
						<li className={styles.listHeader}>If there is no majority decision, a random player will be killed by Cthulhu and that includes Cultists</li>
					</ul> 
					<h4 className={styles.smallHeader}>THE GAME CONTINUES:</h4> 
					<ul>
						<li className={styles.listHeader}> The game continues in these phases, day and night, day and night, until investigators kill all cultists members or cultists outnumber investigators.</li>
					</ul>
					<p className={styles.smallHeader}>THE SECOND GAME: GHOSTS</p>
					<ul>
						<li className={styles.listHeader}>Once you are killed from the game, you are then allowed to participate as a Ghost. The following night after your death will you be provided a cultist/target and you will be able to select an image that best resembles their traits. Your photo selection will appear on the following day to help the remaining investigators identify the cultists.</li>
						<li className={styles.listHeader}>You will talk about it on your walk home and perhaps the next day. That epic game of Mafia you played where you tricked your closest friends and family into thinking you were on their side and then betrayed them for the win.</li>
					</ul>
				</div>
			)} className={styles.questionMark} alt="question mark" />
		</div>
	);
};

export default Rules;