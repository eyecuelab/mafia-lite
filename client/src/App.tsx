import React, { Fragment, useState } from 'react'
import {Routes, Route } from "react-router-dom";
import Home from './Components/Home';
import GameSettings from './Components/GameSettings';

function App() {
	//Need to add routes for 404 and unauthorized 
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/gameSettings" element={<GameSettings />} />
		</Routes>
	)
}

export default App
