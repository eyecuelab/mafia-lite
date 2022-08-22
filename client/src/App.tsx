import React, { Fragment, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import GenericButton from './Components/GenericButton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

type GameCreateInput = {
	hostId: Number
}

interface Game extends GameCreateInput {
	id: string;
	createdAt: string;
	endedAt?: string;
}

const BASE_HEADERS = {
  headers: {
    'Content-Type': 'application/json'
  },
}

const handleResponse = async (response: Response) => {
	const json = await response.json();

  if (!response.ok) {
    throw Error(json.error);
  } else {
    return json;
  }
}

const getGames = async (): Promise<Game[]> => {
	const url = `${API_ENDPOINT}/game`;
	const response = await fetch(url, {...BASE_HEADERS});
	return await handleResponse(response);
}

const createGame = async (newGame: GameCreateInput) => {
	const url = `${API_ENDPOINT}/game`;
	const response = await fetch(url, { ...BASE_HEADERS, method: "POST", body: JSON.stringify(newGame) });	
	return await handleResponse(response);
}

function App() {
	const [hostId, setHostId] = useState("");
	const { isLoading, error, data: games } = useQuery(["games"], getGames);
	const queryClient = useQueryClient();
	const mutation = useMutation(createGame, {
    onSuccess: () => {
      queryClient.invalidateQueries(['games'])
    },
    onError: (error) => {
      if (error instanceof Error) {
        // Do something with the error
        alert(`Oops! ${error.message}`);
      }
    }
  })

	if (isLoading) {
		<p>Loading...</p>
  }

  if (error instanceof Error) {
    return <p>'An error has occurred: {error.message}</p>
  }

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate({
			hostId: parseInt(hostId)
		});
	}

	return (
		<div className='App'>
			<h1>Mafia Lite</h1>
			<form onSubmit={onSubmit}>
				<input name="host-id" onChange={e => setHostId(e.target.value)} />
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

export default App
