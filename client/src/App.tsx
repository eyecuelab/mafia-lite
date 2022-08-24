import React, { Fragment, useState } from 'react'
import './App.css'
import Homepage from './Containers/Homepage';
import Lobby from './Containers/Lobby';



function App() {
	const [inLobby, setInLobby] = useState(false);
	const [gameId, setGameId] = useState(0);

	const openLobby = (gameId: number) => {
		setInLobby(true);
		setGameId(gameId);
	}

	return (
		<div className='App'>
			{ inLobby ? <Lobby gameId={gameId} /> : <Homepage openLobby={openLobby} /> }
		</div>
	);
}

export default App
