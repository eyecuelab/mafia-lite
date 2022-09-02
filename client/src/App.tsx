import { ReactNode, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Lobby from "./Containters/Lobby/Index";
import Homepage from "./Containters/Homepage/Index";
import CreateLobby from "./Containters/CreateLobby/Index";
import JoinGame from "./Containters/JoinGame/Index";
import CreatePlayer from "./Containters/CreatePlayer/Index";
import JoinURL from "./Containters/JoinGame/JoinURL";
import { ModalContext } from "./ModalContext";
import { Modal } from "./Components/Modal";


function App() {
	const [modalContent, setModalContent] = useState<ReactNode | null>(null);
	const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

	const modalProvideValue = {
		content: modalContent,
		isOpen: modalIsOpen,
		callModal: (content: ReactNode) => {
			setModalContent(content);
			setModalIsOpen(true);
		},
		closeModal: () => {
			setModalContent(null);
			setModalIsOpen(false);
		},
	};

	//Need to add routes for 404 and unauthorized
	return (
		<ModalContext.Provider value={modalProvideValue}>
			<Modal />
			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="/newgame" element={<CreateLobby />} />
				<Route path="/join" element={<JoinGame />} />
				<Route path="/newplayer" element={<CreatePlayer />} />
				<Route path="/lobby" element={<Lobby />} />
				<Route path="/join/:code" element={<JoinURL />} />
			</Routes>
		</ModalContext.Provider>
	);
}

export default App;
