import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../../ApiHelper";
import styles from "./Lobby.module.css";
import PlayerCard from "./PlayerCard";

type player = {
	id: number
	name: string
	isHost: boolean
	avatar: string
}
type propTypes = {
	players: Array<player>
}
const PlayerList = (props: propTypes) => {
	const { players } = props;
	const playerListRef = useRef<HTMLDivElement>(null);
	const [accusedPlayer, setAccusedPlayer] = useState<number | null>(null);
	const [accusedPlayerStatus, setAccusedPlayerStatus] = useState<string>("");
	const [socket, setSocket] = useState(io(API_ENDPOINT));
	const [jailedPlayer, setJailedPlayer] = useState<number | null>(null);
	const [voteIsCasted, setVoteIsCasted] = useState<boolean>(false);
	const [numberOfVoters, setNumberOfVoters] = useState<number | null>(null);
	const [voteCount, setVoteCount] = useState<object>({}); //use this to check results of voting

	const numberOfPlayersInGame = players.length + 1;
	// Add one to include the user, players reads only the other players not yourself

	useEffect(() => {
		// 👇️ scroll to bottom every time players change
		playerListRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [players]);

	useEffect(() => {
		// get number of votes casted, get values in voteCount obj, reduce the total tally, set in state
		const getVoteCountIdsByKey = Object.values(voteCount);
		const getTotalNumberOfVotesCasted = getVoteCountIdsByKey.reduce((acc, cur) => acc += cur, 0);
		setNumberOfVoters(getTotalNumberOfVotesCasted);
	}, [voteCount]);

	//Listen for server updates on votes counted and broadcast them back to us in real-time
	socket.on("update_accused_players", (updates) => {
		console.log({ updates });
		setVoteCount(updates.counted);
	});

	const accuse = (playerId: number) => {
		setAccusedPlayer(playerId);
		setAccusedPlayerStatus("accused");
		socket.emit("accuse_player", playerId);
	};

	const castVoteAndSetAccuse = (playerIdNum: number) => {
		// disables ability to accuse once clicked
		setVoteIsCasted(!voteIsCasted);
		accuse(playerIdNum);
	};

	const putPlayerInJail = (playerInJail: number) => {
		setJailedPlayer(playerInJail);
	};

	//check number of voters vs players in room, if ===, voting round is done.
	console.log("num of voters", numberOfVoters, "players in room", numberOfPlayersInGame);

	return (
		<>
			<ul className={styles.playerListContainer}>
				{players?.map((player: player, index: number) => {
					return (
						<>
							<div id={`${player.id} `} className={styles.playerListInnerWrap}
								onClick={
									() => !voteIsCasted ? castVoteAndSetAccuse(player.id) : console.log("Click disabled, vote has already been casted!")} >

								{accusedPlayer === player.id ?
									<PlayerCard player={player} accusedPlayerStatus={accusedPlayerStatus} isMain={false} key={player.id} /> :
									<PlayerCard player={player} playerStatus={jailedPlayer} isMain={false} key={player.id} />
								}
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