import { Route, Routes } from "react-router-dom";
import "./App.css";
import Lobby from "./Containters/Lobby/Index";
import Homepage from "./Containters/Homepage/Index";
import CreateLobby from "./Containters/CreateLobby/Index";
import JoinGame from "./Containters/JoinGame/Index";
import CreatePlayer from "./Containters/CreatePlayer/Index";
import JoinURL from "./Containters/JoinGame/JoinURL";


function App() {
	//Need to add routes for 404 and unauthorized
	return (
		<Routes>
			<Route path="/" element={<Homepage />} />
			<Route path="/newgame" element={<CreateLobby />} />
			<Route path="/join" element={<JoinGame />} />
			<Route path="/newplayer" element={<CreatePlayer />} />
			<Route path="/lobby" element={<Lobby />} />
			<Route path="/join/:code" element={<JoinURL />} />
		</Routes>
	);
}

export default App;
