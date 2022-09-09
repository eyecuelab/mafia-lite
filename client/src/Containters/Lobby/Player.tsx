import { useState } from "react";
import PlayerCard from "./PlayerCard";
import { PlayerType } from "./PlayerList";
import styles from "./Lobby.module.css";

type PlayerProps = {
  player: PlayerType;
  isLobby: boolean;
  voteCast: boolean;
  numberOfVotes: number;
  handleCastVote: (playerId: number) => void,
}

const Player: React.FC<PlayerProps> = ({ player, isLobby, handleCastVote, voteCast, numberOfVotes }) => {
	const [isAccused, setIsAccused] = useState(false);  

	const handleAccusePlayer = () => {
		handleCastVote(player.id);
		setIsAccused(true);
	};

	return (
		<>
			<div
				id={String(player.id)}
				className={styles.playerListInnerWrap}
				onClick={() => {
					if (isLobby || voteCast) {
						console.log("Click disabled, votes already casted, or disabled!");
						return;
					}
					handleAccusePlayer();
				}} >
				{isAccused ?
					<PlayerCard player={player} accusedPlayerStatus="accused" isMain={false} /> :
					<PlayerCard player={player} playerStatus={""} isMain={false} />
				}
				{!!numberOfVotes && (
					<h5>Votes: {numberOfVotes}</h5>
				)}
			</div>
		</>
	);
};

export default Player;