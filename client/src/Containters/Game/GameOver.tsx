import React from "react";
import { Player } from "../../Types/Types";
import PlayerList from "../Lobby/PlayerList";


const GameOver = ({ winners, cultistsWin }: { winners: Player[], cultistsWin: boolean}) => {
	return (
		<React.Fragment>
			<h1>{cultistsWin ? "Cultists" : "Investigators"} Win!</h1>
			<PlayerList
				players={winners}
				isLobby={true}
			/>
		</React.Fragment>
	);
};

export default GameOver;
