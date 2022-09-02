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


	useEffect(() => {
		// 👇️ scroll to bottom every time players change
		playerListRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [players]);

	useEffect(() => {
		socket.on("update_accused_players", accusations => console.log(accusations))
	}, [socket]);

	const accuse = (playerId: number) => {
		setAccusedPlayer(playerId);
		setAccusedPlayerStatus("accused");
		socket.emit("accuse_player", playerId);
	};

	const putPlayerInJail = (playerInJail: number) => {
		setJailedPlayer(playerInJail);
	};


	return (
		<>
			<ul className={styles.playerListContainer}>
				{players?.map((player: player, index: number) => {
					//Will we reuse the player lists?
					return (
						<>
							<div id={`${player.id} `} className={styles.playerListInnerWrap}
								onClick={() => {
									accuse(player.id);
								}} >

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