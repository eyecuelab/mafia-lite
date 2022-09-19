import titleImg from "../../assets/images/Title.png";
import MenuButton from "../../Components/MenuButton";
import HomepageCSS from "./Homepage.module.css";
import Rules from "../../Components/Rules/Rules";


function Homepage() {
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
			<Rules />
		</div>
	);
}

export default Homepage;