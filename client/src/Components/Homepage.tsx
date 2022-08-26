import React, { Fragment, useState } from 'react';
import GenericButton from './GenericButton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../ApiHelper";
import titleImg from "../assets/The Nameless Terror Images/Title.png";
import buttonImg from "../assets/The Nameless Terror Images/UI/image\ 15.png";
import  { useNavigate } from "react-router-dom";


type GameCreatePayload = {
	name: string
	isHost: boolean
}

type JoinGamePayload = {
	name : string
	gameCode : string
}

interface Game extends GameCreatePayload {
	id: string;
	createdAt: string;
	endedAt?: string;
}

const getGames = async (): Promise<Game[]> => {
	const url = `${API_ENDPOINT}/game`;
	const response = await fetch(url, {...BASE_HEADERS});
	return await handleResponse(response);
}

const createGame = async (createGamePayload : GameCreatePayload) => {
	const url = `${API_ENDPOINT}/game`;
	const response = await fetch(url, { ...BASE_HEADERS, method: "POST", body: JSON.stringify(createGamePayload) });	
	return await handleResponse(response);
}

const joinGame = async (joinGamePayload : JoinGamePayload) => {
	const url = `${API_ENDPOINT}/game/join`;
	const response = await fetch(url, { ...BASE_HEADERS, method: "POST", body: JSON.stringify(joinGamePayload) });	
	return await handleResponse(response);
}

function Homepage() {
	const navigate = useNavigate();
	const [hostName, setHostName] = useState("");
	const [gameCode, setGameCode] = useState("");
	const { isLoading, error, data: games } = useQuery(["games"], getGames);
	const queryClient = useQueryClient();
	const joinGameMutation = useMutation(joinGame, {
		onSuccess: (data) => {
			navigate("/lobby", { state : {gameId : data.game.id}, replace : true});
		  },
		  onError: (error) => {
			if (error instanceof Error) {
			  // Do something with the error
			  alert(`Oops! ${error.message}`);
			}
		  }
	})
	const gameMutation = useMutation(createGame, {
    onSuccess: (data) => {
		navigate("/lobby", { state : {gameId : data.game.id}, replace : true});
      queryClient.invalidateQueries(['games']);
    },
    onError: (error) => {
      if (error instanceof Error) {
        // Do something with the error
        alert(`Oops! ${error.message}`);
      }
    }
  })

	if (isLoading) {
		queryClient.invalidateQueries(['games']);
  }

  if (error instanceof Error) {
    return <p>'An error has occurred: {error.message}</p>
  }

	const onHostButtonClick = async (e: React.FormEvent) => {
		e.preventDefault();
		
		await gameMutation.mutateAsync({
			name: hostName,
			isHost: true
		});
	}

	const onJoinButtonClick = async (e : React.FormEvent) => {
		e.preventDefault();
		await joinGameMutation.mutateAsync({
			name: hostName,
			gameCode: gameCode
		})
	}

	return (
		<div>
			<img src={titleImg} alt="The Nameless Terror" />
			<input name="name" placeholder="Enter Name" onChange={e => setHostName(e.target.value)} />
			<input name="gameCode" placeholder="Enter Game Code" onChange={e => setGameCode(e.target.value)} />
			<GenericButton
				link={"/lobby"}
				type={"submit"}
				text={"Host Game"}
				onClick = {onHostButtonClick}
				style={
					{
						background: `url("${buttonImg}") no-repeat`,
						width: "1348px",
						height: "151px"
					}
				}
			/>
			<GenericButton
					text={"Join Game"}
					type={"submit"}
					onClick={onJoinButtonClick}
					style={
						{
							background: `url("${buttonImg}") no-repeat`,
							width: "1348px",
							height: "151px"
						}
					}
				/>
		</div>
	);
}

export default Homepage;