import { useState } from "react";
import PlayerCard from "./PlayerCard";
import { Player } from "../../Types/Types";
import styles from "./Lobby.module.css";

type PlayerProps = {
  player: Player;
  isLobby: boolean;
  voteCast: boolean;
  numberOfVotes: number;
  handleCastVote: (playerId: number) => void,
}

const PlayerCardWrapper: React.FC<PlayerProps> = ({ player, isLobby, handleCastVote, voteCast, numberOfVotes }) => {
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
					<PlayerCard player={player} playerStatus={"accused"} isMain={false} /> :
					<PlayerCard player={player} playerStatus={"alive"} isMain={false} />
				}
				{!!numberOfVotes && (
					<h5>Votes: {numberOfVotes}</h5>
				)}
			</div>
		</>
	);
};

export default PlayerCardWrapper;