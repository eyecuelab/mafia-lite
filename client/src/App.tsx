import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { Fragment, useEffect, useState } from 'react';
import io from "socket.io-client";
import './App.css';
import reactLogo from './assets/react.svg';
import GenericButton from './Components/GenericButton';

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const socket = io(API_ENDPOINT);

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
  const response = await fetch(url, { ...BASE_HEADERS });
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

  useEffect(() => {
    console.log("attempting socket connection")
    socket.on('connect', () => {
      console.log('socket open', socket.id);
    })
  }, [])

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
