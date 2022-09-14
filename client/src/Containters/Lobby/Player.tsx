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
	phase: string,
	team: string
}


const PlayerCardWrapper: React.FC<PlayerProps> = ({ player, isLobby, handleCastVote, voteCast, numberOfVotes, phase, team }) => {
	const [isAccused, setIsAccused] = useState(false);  

	const canVote = (phase === "night" && team ==="investigator") ? false : true;
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
					if (!isLobby || !voteCast && canVote) {
						handleAccusePlayer();
					}
				}} >
				{/* {isAccused ?
					<PlayerCard player={player} isLobby={isLobby} playerStatus={"accused"} /> : */}
				<PlayerCard player={player} isLobby={isLobby} team={team} canVote={canVote} phase={phase}/>
				{(canVote) ? (!!numberOfVotes && (
					<h5 className={styles.voteCounter}>Votes: {numberOfVotes}</h5>
				)) : null }
			</div>
		</>
	);
};

export default PlayerCardWrapper;