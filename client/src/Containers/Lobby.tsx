import React, { Fragment, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../ApiHelper"
import List from "../Components/List"
import GenericButton from '../Components/GenericButton';

type propTypes = {
	gameId: number
}

const getLobbyMembers = async (gameId: number): Promise<string[]> => {
	const url = `${API_ENDPOINT}/players/${gameId}`;
	const response = await fetch(url, {...BASE_HEADERS});
	console.log("TEST")
	return await handleResponse(response);
}

const Lobby = (props: propTypes): JSX.Element => {
	const queryClient = useQueryClient();
	const { isLoading, error, data: lobbyMembers } = useQuery(["players"], () => getLobbyMembers(props.gameId));
	console.log("🚀 ~ file: Lobby.tsx ~ line 18 ~ Lobby ~ lobbyMembers", lobbyMembers)

	if (error instanceof Error) {
		return <p>'An error has occurred: {error.message}</p>;
	}

	if (isLoading) {
		queryClient.invalidateQueries(['games']);
	}

	return (
		<div>
			<h1>Lobby</h1>
			{isLoading && ( <p>Loading...</p> )}
			{!isLoading && ( <List listItems={lobbyMembers} /> )}
				<GenericButton
					type={"submit"}
					text={"Start Game"}
					/>
				<GenericButton
					type={"submit"}
					text={"Game Settings"}
					/>	
		</div>
	);
}

export default Lobby;