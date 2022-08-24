import {Routes, Route } from "react-router-dom";
import GameSettings from './Components/GameSettings';
import Homepage from './Components/Homepage';

function App() {
	//Need to add routes for 404 and unauthorized 
	return (
		<Routes>
			<Route path="/" element={<Homepage />} />
			<Route path="/gameSettings" element={<GameSettings />} />
		</Routes>
	)
}

export default App
