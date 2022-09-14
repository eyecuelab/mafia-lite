import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import styles from "./Lobby.module.css";
import PlayerCardWrapper from "./Player";
import { Player } from "../../Types/Types";


type PlayerListProps = {
	players: Player[],
  isLobby: boolean,
	castVote?: (candidateId: number) => void,
	socket?: Socket,
	phase?: string,
	team?: string,
	isAlive?: boolean
}

type PlayerVotes = {
  playerId: number,
  votes: number
}

const PlayerList: React.FC<PlayerListProps> = ({ players, castVote, isLobby, socket, phase, team, isAlive }) => {
	const playerListRef = useRef<HTMLDivElement>(null);
	const [voteCast, setVoteCast] = useState<boolean>(false);
	const initialVotes = players.map((player) => ({ playerId: player.id, votes: 0 }));
	const [voteTally, setVoteTally] = useState<Array<PlayerVotes>>(initialVotes);
	// Add one to include the user, players reads only the other players not yourself
	// const numberOfPlayersInGame = players.length + 1;

	useEffect(() => {
		playerListRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [players]);

	useEffect(() => {
		if (socket) {
			socket.on("vote_cast", (playerId, newTotal) => {
				setVoteTally((previousTally) => {
					return previousTally.map((voteTally) => {
						if (voteTally.playerId === playerId) {
							return {
								...voteTally,
								votes: newTotal
							};
						} else {
							return voteTally;
						}
					});
				});
			});
		
			return () => {
				socket.off("vote_cast");
			};
		}
	}, [socket]);

	const handleCastVote = (playerId: number) => {
		setVoteCast(true);
		castVote?.(playerId);
	};

	const getPlayerVotes = (playerId: number): number => {
		const voteTotal = voteTally.find((tally: PlayerVotes) => tally.playerId === playerId)?.votes;
		return voteTotal ?? 0;
	};

	return (
		<ul className={isLobby ? styles.playerListContainer : styles.playerListGameContainer}>
			<>
				{players?.map((player: Player) => {
					const numberOfVotes = getPlayerVotes(player.id);
					return (
						<PlayerCardWrapper
							key={player.id}
							player={player}
							isLobby={isLobby}
							handleCastVote={handleCastVote}
							voteCast={voteCast}
							numberOfVotes={numberOfVotes}
							team={team}
							phase={phase}
							isAlive={isAlive}
						/>
					);
				})}
				<div ref={playerListRef} />
			</>
		</ul>
	);
};

export default PlayerList;