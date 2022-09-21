import React, { useEffect, useRef, useState } from "react";
import styles from "./Lobby.module.css";
import PlayerCardWrapper from "./Player";
import { Player } from "../../Types/Types";
import socket from "../../Hooks/WebsocketHook";

type PlayerListProps = {
	players: Player[],
  isLobby: boolean,
	castVote?: (candidateId: number) => void,
	phase?: string,
	clientPlayer?: Player
}

const PlayerList: React.FC<PlayerListProps> = ({ players, castVote, isLobby, phase, clientPlayer }) => {
	const playerListRef = useRef<HTMLDivElement>(null);
	const [voteCast, setVoteCast] = useState<boolean>(false);
	const [voteTally, setVoteTally] = useState<Map<number, number>>(new Map<number, number>());

	useEffect(() => {
		if (isLobby) {
			playerListRef.current?.scrollIntoView({ behavior: "smooth" });	
		} else {
			playerListRef.current?.scrollTo({ top: 10, behavior: "smooth" });
		}
		
	}, [players]);

	useEffect(() => {
		if (!isLobby) {
			socket.on("vote_cast", (playerId, newTotal) => {
				voteTally.set(playerId, newTotal);
				setVoteTally(new Map(voteTally));
				
			});
			return () => {
				socket.off("vote_cast");
			};
		}
	}, [isLobby]);

	const handleCastVote = (playerId: number) => {
		setVoteCast(true);
		castVote?.(playerId);
	};

	return (
		<ul className={isLobby ? styles.playerListContainer : styles.playerListGameContainer}>
			<>
				{players?.map((player: Player) => {
					const numberOfVotes = voteTally.get(player.id);
					return (
						<PlayerCardWrapper
							key={player.id}
							player={player}
							isLobby={isLobby}
							handleCastVote={handleCastVote}
							voteCast={voteCast}
							numberOfVotes={numberOfVotes ?? 0}
							clientPlayer={clientPlayer}
							phase={phase}
						/>
					);
				})}
				<div ref={playerListRef} />
			</>
		</ul>
	);
};

export default PlayerList;