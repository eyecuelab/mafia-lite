import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { Fragment, useEffect, useState } from 'react';
import io from "socket.io-client";
import './App.css';
import reactLogo from './assets/react.svg';

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const socket = io(API_ENDPOINT);

type UserCreateInput = {
  email: string,
  name?: string
}

interface User extends UserCreateInput {
  id: string;
}

const BASE_HEADERS = {
  headers: {
    'Content-Type': 'application/json'
  },
}

const handleResponse = async (response: Response) => {
  console.log(response)
  const json = await response.json();
  if (!response.ok) {
    throw Error(json.error);
  } else {
    return json;
  }
}

//using /game instead of /users to view UI
const getUsers = async (): Promise<User[]> => {
  const url = `${API_ENDPOINT}/game`;
  const response = await fetch(url, { ...BASE_HEADERS });
  console.log(response)
  return await handleResponse(response);
}

const createUser = async (user: UserCreateInput) => {
  const url = `${API_ENDPOINT}/signup`;
  const response = await fetch(url, { ...BASE_HEADERS, method: 'POST', body: JSON.stringify(user) });
  return await handleResponse(response);
}

function App() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const queryClient = useQueryClient();

  const { isLoading, error, data: users } = useQuery(["users"], getUsers);


  useEffect(() => {
    console.log("attempting socket connection")
    socket.on('connect', () => {
      console.log('socket open', socket.id);
    })
  }, [])

  const mutation = useMutation(createUser, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['users'])
    },
    onError: (error) => {
      if (error instanceof Error) {
        // Do something with the error
        alert(`Oops! ${error.message}`);
      }
    }
  })

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (error instanceof Error) {
    return <p>'An error has occurred: {error.message}</p>
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      name: userName,
      email: userEmail,
    })
  };

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React Sample</h1>
      <h2>I am the signup form!</h2>
      <form className="form" onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input name="name" onChange={(e) => setUserName(e.target.value)} />
        <label htmlFor="email">Email</label>
        <input name="email" onChange={(e) => setUserEmail(e.target.value)} />
        <button type="submit" disabled={!userEmail}>
          Add User
        </button>
      </form>
      <div className="card">
        <h2>List of existing users:</h2>
        {users?.map((user) => {
          return (
            <Fragment key={user.id}>
              <p>{user.name} ({user.email})</p>
            </Fragment>
          );
        })}
        {!users?.length && (
          <p>No users</p>
        )}
      </div>
    </div>
  )
}

export default App
