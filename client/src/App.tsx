import { Route, Routes } from "react-router-dom";
import './App.css';
import Homepage from './Components/Homepage/Homepage';
import Lobby from "./Components/Lobby/Lobby";

function App() {
  //Need to add routes for 404 and unauthorized 
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/lobby" element={<Lobby />} />
    </Routes>
  )
}

export default App
