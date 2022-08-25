import {Routes, Route } from "react-router-dom";
import Lobby from "./Components/Lobby";
import Homepage from './Components/Homepage';
import './App.css';

function App() {
	//Need to add routes for 404 and unauthorized 
	return (
		<Routes>
			<Route path="/" element={<Homepage />} />
			<Route path="/lobby" element={<Lobby gameId={43} />} />
		</Routes>
	)
}

export default App
