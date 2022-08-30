import { useState } from 'react';
import GenericButton from '../GenericButton';
import titleImg from "../../assets/The Nameless Terror Images/Title.png";
import buttonImg from "../../assets/The Nameless Terror Images/UI/image\ 15.png";
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../../ApiHelper";
import { toast } from 'react-toastify';
import io from "socket.io-client";
import HomepageCSS from "./Homepage.module.css";

function Homepage() {
	const [socket, setSocket] = useState(io(API_ENDPOINT));

		/*** Socket Functions ***/

		const notify = (content: string) => toast(content);

		socket.on("message", data => notify(data))
		const joinExistingGame = (IdOfGame: string) => {
			let existingGameParams = {
				roomId: IdOfGame
			}
			socket.emit("join_room", existingGameParams);
		}

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
					text={"HOST A GAME"}
					style={
						{
							backgroundImage: `url("${buttonImg}")`,
						}
					}
				/>

				<GenericButton
					link={"/joingame"}
					className={HomepageCSS["user-selection-input"]}
					text={"JOIN A GAME"}
					style={
						{
							backgroundImage: `url("${buttonImg}")`,
						}
					}
				/>
			</div>
		</div>
	);
}

export default Homepage;