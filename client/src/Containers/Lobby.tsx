import React, { Fragment, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../ApiHelper"
import List, { listItem } from "../Components/List"

type propTypes = {
	gameId: number
}

interface LobbyMembers {
	id: number
	isHost: boolean,
	name: string,
}

const getLobbyMembers = async (gameId: number): Promise<LobbyMembers[]> => {
	const url = `${API_ENDPOINT}/players/${gameId}`;
	const response = await fetch(url, {...BASE_HEADERS});
	return await handleResponse(response);
}

const Lobby = (props: propTypes): JSX.Element => {
	const queryClient = useQueryClient();
	const { isLoading, error, data } = useQuery(["players"], () => getLobbyMembers(props.gameId));

	if (error instanceof Error) {
		return <p>'An error has occurred: {error.message}</p>;
	}

	if (isLoading) {
		queryClient.invalidateQueries(['games']);
	}

	const playerNames = data ? data.map((player, index) => {
		const item: listItem = { id: index, data: player.name };
		return item;
	}) : []

	return (
		<div>
			<h1>Lobby</h1>
			{isLoading && ( <p>Loading...</p> )}
			{!isLoading && ( <List listItems={ playerNames } /> )}
		</div>
	);
}

export default Lobby;