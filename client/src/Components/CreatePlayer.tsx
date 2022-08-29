import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../ApiHelper";
import { useLocation } from 'react-router-dom';
import GenericButton from "./GenericButton";
import buttonImg from "../assets/The Nameless Terror Images/UI/image\ 15.png";

type PlayerCreateInput = {
	gameId: number,
	isHost: boolean,
	name: string
}

interface locationState {
	gameId: number,
	isHost: boolean,
	lobbyName: string
}

const createPlayer = async (playerInput: PlayerCreateInput) => {
	const url = `${API_ENDPOINT}/player`;
	const response = await fetch(url, { ...BASE_HEADERS, method: "POST", body: JSON.stringify(playerInput) });	
	return await handleResponse(response);
}

function CreatePlayer() {
	const location = useLocation();
	const state = location.state as locationState;
	const { gameId, isHost } = state;

	const navigate = useNavigate();
	const [name, setName] = useState("");
	
	const playerMutation = useMutation(createPlayer, {
    onSuccess: () => {
      navigate("/lobby", { state: { gameId: gameId }, replace: true });
    },
    onError: (error) => {
      if (error instanceof Error) {
        alert(`Oops! ${error.message}`);
      }
    }
  });

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		playerMutation.mutate({
			gameId: gameId,
			isHost: isHost,
			name: name
		});
	};

	return (
		<form onSubmit={onSubmit}>
			<input name="name" placeholder="Enter Character Name" onChange={e => setName(e.target.value)} />
			<GenericButton
				type={"submit"}
				text={"Continue"}
				style={
					{
						background: `url("${buttonImg}")`
					}
				}
			/>
		</form>
	);
}

export default CreatePlayer;