import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../../ApiHelper";
import titleImg from "../../assets/The Nameless Terror Images/Title.png";
import buttonImg from "../../assets/The Nameless Terror Images/UI/image\ 15.png";
import GenericButton from '../GenericButton';
import HomepageCSS from "./Homepage.module.css";

function Homepage() {

	return (
		<div>
			<div className={HomepageCSS["homepage-title-wrapper"]}>
				<img src={titleImg} className={HomepageCSS.titleImage} alt="The Nameless Terror" />
				<h5>A Lovecraftian Inspired Mafia Game</h5>
			</div>

			<div className={HomepageCSS["hostOrJoinBtns-wrapper"]}>
				<GenericButton
					link={"/newgame"}
					className={HomepageCSS["user-selection-input"]}
					text={"Host Game"}
					style={
						{
							background: `url("${buttonImg}")`,
						}
					}
				/>

				<GenericButton
					link={"/joingame"}
					className={HomepageCSS["user-selection-input"]}
					text={"Join Game"}
					style={
						{
							background: `url("${buttonImg}")`,
						}
					}
				/>
			</div>
		</div>
	);
}

export default Homepage;