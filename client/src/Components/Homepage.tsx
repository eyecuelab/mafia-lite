import React, { Fragment, useState } from 'react';
import GenericButton from './GenericButton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../ApiHelper";
import titleImg from "../assets/The Nameless Terror Images/Title.png";
import buttonImg from "../assets/The Nameless Terror Images/UI/image\ 15.png";


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

function Homepage() {
	const [hostName, setHostName] = useState("");
	const { isLoading, error, data: games } = useQuery(["games"], getGames);
	const queryClient = useQueryClient();
	const gameMutation = useMutation(createGame, {
    onSuccess: (data) => {
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

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		gameMutation.mutate({
			name: hostName
		});
	}

	return (
		<div>
			<img src={titleImg} alt="The Nameless Terror" />
			<form onSubmit={onSubmit}>
				<input name="name" placeholder="Enter Name" onChange={e => setHostName(e.target.value)} />
				<GenericButton
					link={"/lobby"}
					type={"submit"}
					text={"Host Game"}
					style={
						{
							background: `url("${buttonImg}") no-repeat`,
							width: "1348px",
							height: "151px"
						}
					}
				/>
			</form>
			<GenericButton
					text={"Join Game"}
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