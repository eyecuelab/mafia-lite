import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../ApiHelper";
import { useMutation } from '@tanstack/react-query';
import GenericButton from './GenericButton';
import buttonImg from "../assets/The Nameless Terror Images/UI/image\ 15.png";

type GameCreatePayload = {
	name: string,
	size: number
}

interface Game extends GameCreatePayload {
	id: string;
	createdAt: string;
	endedAt?: string;
}

const createGame = async (gameInput: GameCreatePayload) => {
	const url = `${API_ENDPOINT}/game`;
	const response = await fetch(url, { ...BASE_HEADERS, method: "POST", body: JSON.stringify(gameInput) });
	return await handleResponse(response);
}

function CreateLobby() {
	const [lobbyName, setLobbyName] = useState("");
	const [lobbySize, setLobbySize] = useState(1);
	const navigate = useNavigate();
	const gameMutation = useMutation(createGame, {
    onSuccess: (data) => {
      navigate("/newplayer", { state: { gameId: data.game.id, lobbyName: data.game.name, playerId: data.player.id }, replace: true });
      console.log("🚀 ~ file: CreateLobby.tsx ~ line 32 ~ CreateLobby ~ data", data)
			
    },
    onError: (error) => {
      if (error instanceof Error) {
        alert(`Oops! ${error.message}`);
      }
    }
  });

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		gameMutation.mutate({
			name: lobbyName,
			size: lobbySize
		});
	};

	return (
		<form onSubmit={onSubmit}>
			<input name="name" placeholder="Enter Lobby Name" onChange={e => setLobbyName(e.target.value)} />
			<input name="size" placeholder="Enter Lobby Size" type={"number"} onChange={e => setLobbySize(parseInt(e.target.value))} />
			<GenericButton 
				text={"Create Game"}
				style={
					{
						background: `url("${buttonImg}") no-repeat`,
						width: "1348px",
						height: "151px"
					}
				}
			/>
		</form>
	);
}

export default CreateLobby;