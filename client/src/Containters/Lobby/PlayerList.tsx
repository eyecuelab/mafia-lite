import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../../ApiHelper";
import styles from "./Lobby.module.css";
import PlayerCard from "./PlayerCard";

type player = {
	id: number
	name: string
	isHost: boolean
	gameId: number
	avatar: string
}

type propTypes = {
	players: player[],
	castVote?: (candidateId: number) => void
}
const PlayerList = (props: propTypes) => {
	const { players, castVote } = props;
	const playerListRef = useRef<HTMLDivElement>(null);
	const [accusedPlayer, setAccusedPlayer] = useState<number | null>(null);
	const [accusedPlayerStatus, setAccusedPlayerStatus] = useState<string>("");
	const [socket] = useState(io(API_ENDPOINT));
	const [playerStatusAtNight, setPlayerStatusAtNight] = useState<string | null>(null);
	const [voteIsCasted, setVoteIsCasted] = useState<boolean>(false);
	const [totalNumberOfVotes, setTotalNumberOfVotes] = useState<number>(0);
	const [voteTally, setVoteTally] = useState(new Map<number, number>()); //use this to check results of voting

	// Set to "true" to disable clickable events in Lobby screen, but "false" in Game screen
	const [disableAccuse, setDisableAccuse] = useState<boolean>(false);
	// Add one to include the user, players reads only the other players not yourself
	const numberOfPlayersInGame = players.length + 1;


	useEffect(() => {
		playerListRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [players]);


	socket.on("update_accused_players", (counted: Map<number, number>) => {
		console.log(Object.keys(counted));
		//Listen for server updates on vote tally, and broadcast them back to us in real-time
		setVoteTally(counted);
	});

	// console.log(voteTally.keys().next());

	const accuse = (playerId: number) => {
		if (castVote) {
			setAccusedPlayer(playerId);
			setAccusedPlayerStatus("accused");
			castVote(playerId);
		}
	};

	const castVoteAndSetAccuse = (playerIdNum: number) => {
		// disables ability to accuse once clicked
		setVoteIsCasted(!voteIsCasted);
		accuse(playerIdNum);
		console.log(players[0].gameId);
		socket.emit("accuse_player", playerIdNum, players[0].gameId);
	};

	if (totalNumberOfVotes >= numberOfPlayersInGame) {
		//check number of voters vs players in room, if ===, voting round is done.
		console.log("num of votes", totalNumberOfVotes, "players in room", numberOfPlayersInGame);
		socket.emit("all_votes_casted");
	}

	return (
		<>
			<ul className={styles.playerListContainer}>
				{players?.map((player: player, index: number) => {
					return (
						<>
							<div id={`${player.id} `} className={styles.playerListInnerWrap}
								onClick={
									() => !voteIsCasted && !disableAccuse ? castVoteAndSetAccuse(player.id) : console.log("Click disabled, votes already casted, or disabled!")} >

								{accusedPlayer === player.id ?
									<PlayerCard player={player} accusedPlayerStatus={accusedPlayerStatus} isMain={false} key={player.id} /> :
									<PlayerCard player={player} playerStatus={playerStatusAtNight} isMain={false} key={player.id} />
								}
								<h5>Votes: {voteTally.get(player.id)}</h5>
								{/*voteTally[`${player.id}`] 				 */}
							</div>
						</>
					);
				})}
				<div ref={playerListRef} />
			</ul>
		</>
	);
};

export default PlayerList;