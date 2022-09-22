import React from "react";
import styles from "../../Lobby/Lobby.module.css";
import GamePlayerCard from "./GamePlayerCard";
import { Player } from "../../../Types/Types";
import { useModal } from "../../../ModalContext";
import useGameStateQuery from "../../../Hooks/GameDataHook";

type PropTypes = {
	player: Player
	numVotes: number
	handleCastVote: (player: Player) => void
	selected: boolean
}

const VoteCountWrapper: React.FC<PropTypes> = ({ player, numVotes, handleCastVote, selected }) => {
	const { gameQueryError, gameData } = useGameStateQuery();
	const { callModal } = useModal();

	if (gameQueryError instanceof Error) {
		callModal(gameQueryError.message);
	}

	return (
		<React.Fragment>
			<div className={styles.playerListInnerWrap} onClick={() => handleCastVote(player)}>
				<GamePlayerCard player={player} selected={selected} />
				{numVotes > 0 && <h5 className={`${styles.voteCounter} ${gameData?.currentRound?.currentPhase === "day" ? styles.dayVoteCounter : styles.nightVoteCounter}`}>Votes: {numVotes}</h5>}
			</div>
		</React.Fragment>
	);
};

export default VoteCountWrapper;