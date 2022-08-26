import { Route, Routes } from "react-router-dom";
import './App.css';
import Homepage from './Components/Homepage';
import Lobby from "./Components/Lobby";

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
