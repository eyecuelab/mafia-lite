import titleImg from "../../assets/images/Title.png";
import MenuButton from "../../Components/MenuButton";
import HomepageCSS from "./Homepage.module.css";
import questionMark from "../../assets/images/question_mark.png";
import { useModal } from "../../ModalContext";


function Homepage() {
	const { callModal } = useModal();
	return (
		<div>
			<div className={HomepageCSS["homepage-title-wrapper"]}>
				<img src={titleImg} className={HomepageCSS.titleImage} alt="The Nameless Terror" />
				<h5>A Lovecraftian Inspired Mafia Game</h5>
			</div>

			<div className={HomepageCSS["hostOrJoinBtns-wrapper"]}>
				<MenuButton
					link={"/newgame"}
					className={HomepageCSS["user-selection-input"]}
					text={"HOST A GAME"}
				/>

				<MenuButton
					link={"/join"}
					className={HomepageCSS["user-selection-input"]}
					text={"JOIN A GAME"}
				/>
			</div>
			<div className={HomepageCSS["homepage-footer"]}>
				<p>HOW TO PLAY</p>
				<img src={questionMark} onClick={() => callModal(
					<div><h2>How to play The Nameless Terror</h2>
						<ul>
							<li>First Night:</li> 
							<ul>
								<li>The narrator begins at night by telling all players to close their eyes. Cultist, wake up. See your fellow members,” she says. Cultist, go to sleep.” In the first round, this is all that happens.</li>
							</ul>
							<li>First Day:</li>
							<ul>
								<li>Everyone opens their eyes and the games begin. You must just start accusing people out of nowhere. Who is acting shyer than usual?</li> 
								<li>Who is talking a bit too much?</li> 
								<li>Ask straight-forward questions about identities.</li> 
								<li>Look people directly in the eye and ask them if they are in the mafia.</li> 
								<li>Once a nomination to kill is made, someone must second it for the player to be seriously considered in the cultists. </li>
								<li>If you have two solid nominations, all players then vote to kill, majority wins.</li> 
								<li>You can have as many nominations as you want, but you need a majority to kill.</li> 
								<li>When a player is killed, they are no longer allowed to speak and their identity is not revealed.</li>
							</ul> 
							<li>Second Night:</li> 
							<ul>
								<li>All players eyes are closed and the narrator awakens the cultists and asks who they want to kill. She then awakens the doctor for the first time and asks who they want to save. And then, she awakens the detective and asks who they want to know about.</li>
							</ul>
							

							<li>Third Day:</li> 
							<ul>
								<li>The narrator awakens all players and someone has been killed, unless the doctor has figured out who the cultists had their sights on and saved this player. The game continues in these phases, day and night, day and night, until investigators kill all cultists members or cultists outnumber investigators.</li>
							</ul>
							

							{/* <p>THE SECOND GAME</p>

							<li>Once you are killed from the game, you are then allowed to see the identities of all players at night. You will be shocked to see who has been fooling you and will bond will the other players who have been killed. It is almost just as thrilling to watch the game take place—knowing all the identities—as it is to be alive playing. You will talk about it on your walk home and perhaps the next day. That epic game of Mafia you played where you tricked your closest friends and family into thinking you were on their side and then betrayed them for the win.</li> */}

						</ul>
					</div>
				)} className={HomepageCSS.questionMark} alt="The Nameless Terror" />
			</div>
		</div>
	);
}

export default Homepage;