import React, { useEffect, useState } from "react";
import socket from "../../../Hooks/WebsocketHook";
import styles from "../../Lobby/Lobby.module.css";
import { useModal } from "../../../ModalContext";
import useGameStateQuery from "../../../Hooks/GameDataHook";
import VoteCountWrapper from "./VoteCountWrapper";
import { Player } from "../../../Types/Types";

type PropTypes = {
	castVote: (candidateId: number) => void
}

const GamePlayerList: React.FC<PropTypes> = ({ castVote }) => {
	const { gameQueryIsLoading, gameQueryError, gameData } = useGameStateQuery();
	const { callModal } = useModal();

	const [ voteTally, setVoteTally ] = useState<Map<number, number>>(new Map<number, number>());
	const [ selectedId, setSelectedId ] = useState(-1);

	if (gameQueryError instanceof Error) {
		callModal(gameQueryError.message);
	}

	const canSeeVote = gameData?.currentRound?.currentPhase === "day" || gameData?.thisPlayer.team === "cultist";
	useEffect(() => {
		socket.on("vote_cast", (playerId: number, newTotal: number) => {
			if (canSeeVote) {
				voteTally.set(playerId, newTotal);
				setVoteTally(new Map(voteTally));
			}
		});

		socket.on("start_night", () => {
			setVoteTally(new Map<number, number>());
		});

		socket.on("start_day", () => {
			setVoteTally(new Map<number, number>());
		});

		return () => {
			socket.off("vote_cast");
			socket.off("start_night");
			socket.off("start_day");
		};
	});

	// Can vote if voter is alive, phase is day or voter is cultist, and they are not voting for themselves
	const handleCastVote = (player: Player) => {
		if (gameData?.thisPlayer.status === "alive" && (gameData.currentRound?.currentPhase === "day" || (gameData.thisPlayer.team === "cultist" && player.team !== "cultist")) && player.id !== gameData?.thisPlayer.id) {
			castVote(player.id);
			setSelectedId(player.id);
		}
	};

	const playerCards = gameData?.players.map((player) => {
		const numVotes = voteTally.get(player.id) ?? 0;
		return <VoteCountWrapper key={player.id} player={player} numVotes={numVotes} handleCastVote={handleCastVote} selected={selectedId === player.id} />;
	});

	if (gameQueryIsLoading) {
		return <p>Loading...</p>;
	}

	return (
		<React.Fragment>
			<ul className={styles.playerListGameContainer}>
				{playerCards}
			</ul>
		</React.Fragment>
	);
};

export default GamePlayerList;