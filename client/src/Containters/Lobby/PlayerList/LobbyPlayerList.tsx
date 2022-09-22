import React, { useEffect } from "react";
import styles from "../Lobby.module.css";
import socket from "../../../Hooks/WebsocketHook";
import useGameStateQuery from "../../../Hooks/GameDataHook";
import { useModal } from "../../../ModalContext";
import { useQueryClient } from "@tanstack/react-query";
import LobbyPlayerCard from "./LobbyPlayerCard";


const LobbyPlayerList: React.FC = () => {
	const { gameQueryIsLoading, gameQueryError, gameData } = useGameStateQuery();
	const { callModal } = useModal();
	const queryClient = useQueryClient();

	useEffect(() => {
		socket.on("playerIsReady", () => {
			queryClient.invalidateQueries(["games"]);
		});

		socket.on("player_joined_lobby", () => {
			queryClient.invalidateQueries(["games"]);
		});

		return () => {
			socket.off("playerIsReady");
			socket.off("player_joined_lobby");
		};
	});
	
	if (gameQueryError instanceof Error) {
		callModal(gameQueryError.message);
	}

	if (gameQueryIsLoading) {
		return <p>Loading...</p>;
	}

	return (
		<React.Fragment>
			<ul className={styles.playerListContainer}>
				{gameData?.players.map((player) => {
					if (player.id !== gameData?.thisPlayer.id) {
						return <LobbyPlayerCard key={player.id} player={player} />;
					}
				}
				)}
			</ul>
		</React.Fragment>
	);
};

export default LobbyPlayerList;