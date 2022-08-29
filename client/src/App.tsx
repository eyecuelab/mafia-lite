import { Routes, Route } from "react-router-dom";
import Lobby from "./Components/Lobby/Lobby";
import Homepage from './Components/Homepage/Homepage';
import CreateLobby from "./Components/CreateLobby";
import CreatePlayer from "./Components/CreatePlayer";
import './App.css';
import JoinGame from "./Components/JoinGame";

function App() {
	//Need to add routes for 404 and unauthorized
	return (
		<Routes>
			<Route path="/" element={<Homepage />} />
			<Route path="/newgame" element={<CreateLobby />} />
			<Route path="/joingame" element={<JoinGame />} />
			<Route path="/newplayer" element={<CreatePlayer />} />
			<Route path="/lobby" element={<Lobby />} />
		</Routes>
	);
}

export default App
