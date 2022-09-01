import React, { useEffect, useRef } from "react";
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

	useEffect(() => {
		// 👇️ scroll to bottom every time messages change
		playerListRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [players]);

	return (
		<ul className={styles.playerListContainer}>
			{players?.map((player: player, index: number) => {
				return (
					<PlayerCard player={player} isMain={false} key={index} />
				);
			})}
			<div ref={playerListRef} />
		</ul>
	);
};

export default PlayerList;