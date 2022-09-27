import React from "react";
import styles from "./Lobby.module.css";
import useGameStateQuery from "../../Hooks/GameDataHook";
import { useModal } from "../../ModalContext";
import LobbyPlayerCard from "./LobbyPlayerCard";


const LobbyPlayerList: React.FC = () => {
	const { gameQueryIsLoading, gameQueryError, gameData } = useGameStateQuery();
	const { callModal } = useModal();
	
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
						return <LobbyPlayerCard key={player.id} player={player} thisPlayer={gameData.thisPlayer} />;
					}
				}
				)}
			</ul>
		</React.Fragment>
	);
};

export default LobbyPlayerList;