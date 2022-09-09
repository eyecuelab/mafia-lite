import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { API_ENDPOINT } from "../../ApiHelper";
import styles from "./Lobby.module.css";
import Player from "./Player";

const socket: Socket = io(API_ENDPOINT);

export type PlayerType = {
	id: number
	name: string
	isHost: boolean
	gameId: number
	avatar: string
}

type PlayerListProps = {
	players: PlayerType[],
  isLobby: boolean,
	castVote?: (candidateId: number) => void,
}

type PlayerVotes = {
  playerId: number,
  votes: number
}

const PlayerList: React.FC<PlayerListProps> = ({ players, castVote, isLobby }) => {
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
	}, []);

	const handleCastVote = (playerId: number) => {
		setVoteCast(true);
		castVote?.(playerId);
	};

	const getPlayerVotes = (playerId: number): number => {
		const voteTotal = voteTally.find((tally: PlayerVotes) => tally.playerId === playerId)?.votes;
		return voteTotal ?? 0;
	};

	return (
		<ul className={styles.playerListContainer}>
			<>
				{players?.map((player: PlayerType) => {
					const numberOfVotes = getPlayerVotes(player.id);
					return (
						<Player
							key={player.id}
							player={player}
							isLobby={isLobby}
							handleCastVote={handleCastVote}
							voteCast={voteCast}
							numberOfVotes={numberOfVotes}
						/>
					);
				})}
				<div ref={playerListRef} />
			</>
		</ul>
	);
};

export default PlayerList;