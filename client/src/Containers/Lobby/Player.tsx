import { useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";
import { Player } from "../../Types/Types";
import styles from "./Lobby.module.css";

type PlayerProps = {
  player: Player;
  isLobby: boolean;
  voteCast: boolean;
  numberOfVotes: number;
  handleCastVote: (playerId: number) => void,
	phase?: string,
	clientPlayer?: Player
}


const PlayerCardWrapper: React.FC<PlayerProps> = ({ player, isLobby, handleCastVote, voteCast, numberOfVotes, phase, clientPlayer }) => {
	const team = clientPlayer?.team;
	const isAlive = clientPlayer?.status === "alive";
	const isPlayer = (player.id === clientPlayer?.id);
	const [canVote, setCanVote] = useState(true);
	const [playerStatus, setPlayerStatus] = useState("alive");

	useEffect(() => {
		setCanVote(!!(isAlive) && (phase === "day" || team === "cultist"));
	}, [isAlive, phase, team]);

	const handleAccusePlayer = () => {
		handleCastVote(player.id);

		if (phase === "day") {
			setPlayerStatus("accused");
		} else {
			setPlayerStatus("murder");
		}
	};

	return (
		<>
			<div
				id={String(player.id)}
				className={styles.playerListInnerWrap}
				onClick={() => {
					if (!isLobby && !voteCast && canVote) {
						handleAccusePlayer();
					}
				}} >
				<PlayerCard isPlayer={isPlayer} player={player} playerStatus={player.status === "alive" ? playerStatus : player.status} isLobby={isLobby} team={team} canVote={canVote} phase={phase}/>
				{(canVote) ? (!!numberOfVotes && (
					<h5 className={`${styles.voteCounter} ${phase === "day" ? styles.dayVoteCounter : styles.nightVoteCounter}`}>Votes: {numberOfVotes}</h5>
				)) : null }
			</div>
		</>
	);
};

export default PlayerCardWrapper;