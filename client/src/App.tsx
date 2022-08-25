// <<<<<<< HEAD
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import React, { Fragment, useEffect, useState } from 'react';
// import io from "socket.io-client";
// import './App.css';
// import GenericButton from './Components/GenericButton';
// import Homepage from './Containers/Homepage';
// import Lobby from './Containers/Lobby';

// const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
// const socket = io(API_ENDPOINT);

// function App() {
//   const [inLobby, setInLobby] = useState(false);
//   const [gameId, setGameId] = useState(0);

//   const openLobby = (gameId: number) => {
//     setInLobby(true);
//     setGameId(gameId);
//   }

//   return (
//     <div className='App'>
//       {inLobby ? <Lobby gameId={gameId} /> : <Homepage openLobby={openLobby} />}
//     </div >
//   );
// =======
import { Routes, Route } from "react-router-dom";
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
  // >>>>>>> 757581afcd52fabe9aec16428f1a8d56f7c570be
}

export default App
