import React, { Fragment, useState } from 'react';
import GenericButton from '../Components/GenericButton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../ApiHelper";

type propTypes = {
	openLobby: Function
}

type GameCreateInput = {
	name: string
}

interface Game extends GameCreateInput {
	id: string;
	createdAt: string;
	endedAt?: string;
}

const getGames = async (): Promise<Game[]> => {
	const url = `${API_ENDPOINT}/game`;
	const response = await fetch(url, {...BASE_HEADERS});
	return await handleResponse(response);
}

const createGame = async (username: GameCreateInput) => {
	const url = `${API_ENDPOINT}/game`;
	const response = await fetch(url, { ...BASE_HEADERS, method: "POST", body: JSON.stringify(username) });	
	return await handleResponse(response);
}

function Homepage(props: propTypes) {
	const [hostName, setHostName] = useState("");
	const { isLoading, error, data: games } = useQuery(["games"], getGames);
	const queryClient = useQueryClient();
	
	const gameMutation = useMutation(createGame, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['games']);
			props.openLobby(data.game.id);
    },
    onError: (error) => {
      if (error instanceof Error) {
        // Do something with the error
        alert(`Oops! ${error.message}`);
      }
    }
  })

	if (isLoading) {		
		//return <p>Loading...</p>
  }

  if (error instanceof Error) {
    return <p>'An error has occurred: {error.message}</p>
  }

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		gameMutation.mutate({
			name: hostName
		});
	}

	return (
		<div>
			<h1>Mafia Lite</h1>
			<form onSubmit={onSubmit}>
				<input name="name" placeholder="Enter Name" onChange={e => setHostName(e.target.value)} />
				<GenericButton
					type={"submit"}
					text={"Host Game"}
				/>
			</form>
			<div>
				<h2>Existing Games:</h2>
				{games?.map(game => {
					return (
						<Fragment key={game.id}>
							<p>game: {game.id}</p>
						</Fragment>
					);
				})}
				{!games?.length && (
					<p>No games</p>
				)}
			</div>
		</div>
	);
}

export default Homepage;