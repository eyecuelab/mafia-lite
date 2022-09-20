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
					<h2 className={styles.headerTwo}>How to play The Nameless Terror</h2>
					<h4>First Night:</h4> 
					<ul>
						<li className={styles.listHeader}>The game begins and there will be a Cultists icon designating who is a Cultist that only Cultist can see. The Cultists will immediately forced to kill an Investigator. A majority decision has to be made for an Investigator to be killed. If there is no majority decision, a random player will be killed</li>
					</ul>
					<h4>First Day:</h4>
					<ul>
						<li className={styles.listHeader}>The first day round begins! You must just start accusing people out of nowhere. Who is acting shyer than usual?</li> 
						<li className={styles.listHeader}>Who is talking a bit too much?</li> 
						<li className={styles.listHeader}>Ask straight-forward questions about identities.</li> 
						<li className={styles.listHeader}>Look people directly in the eye and ask them if they are a Cultist.</li> 
						<li className={styles.listHeader}>Once an accusation to kill is made, someone must second it for the player to be seriously considered a cultists. </li>
						<li className={styles.listHeader}>If you have two solid nominations, all players then vote to kill, majority wins.</li> 
						<li className={styles.listHeader}>You can have as many nominations as you want, but you need a majority to kill.</li> 
						<li className={styles.listHeader}>When an Investigator is nominated and receives a majority they are jailed rather than killed and they cannot participate til the following round. Investigators are unable to be killed by the Cultists while jailed. If a Cultist is nominated and receives a majority they are killed and are able to participate as a Ghost.</li>
					</ul> 
					<h4>Second Night:</h4> 
					<ul>
						<li className={styles.listHeader}>All players eyes are closed and the narrator awakens the cultists and asks who they want to kill. She then awakens the doctor for the first time and asks who they want to save. And then, she awakens the detective and asks who they want to know about.</li>
					</ul>
					<h4>Third Day:</h4> 
					<ul>
						<li className={styles.listHeader}> The game continues in these phases, day and night, day and night, until investigators kill all cultists members or cultists outnumber investigators.</li>
					</ul>
					{/* <p>THE SECOND GAME</p>

							<li>Once you are killed from the game, you are then allowed to see the identities of all players at night. You will be shocked to see who has been fooling you and will bond will the other players who have been killed. It is almost just as thrilling to watch the game take place—knowing all the identities—as it is to be alive playing. You will talk about it on your walk home and perhaps the next day. That epic game of Mafia you played where you tricked your closest friends and family into thinking you were on their side and then betrayed them for the win.</li> */}
				</div>
			)} className={styles.questionMark} alt="question mark" />
		</div>
	);
};

export default Rules;