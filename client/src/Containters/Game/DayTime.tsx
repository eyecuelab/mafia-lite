import React from "react";
import PlayerFocusCard from "../PlayerFocusCard";
import GenericButton from "../../Components/GenericButton";
import PlayerList from "../Lobby/PlayerList";
import { GameData, Player } from "../../Types/Types";
import socket from "../../Hooks/WebsocketHook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../../ModalContext";
import { postData } from "../../ApiHelper";

const beginNight = async (gameId : number): Promise<void> => postData("/startNight", { gameId });

const DayTime = ({ gameData, hasResult, votingResults, finishVote, endRound }: { gameData: GameData, hasResult: boolean, votingResults?: Player, finishVote: (candidateId: number) => void, endRound: () => void }) => {
	const queryClient = useQueryClient();
	const { callModal } = useModal();

	const startNightMutation = useMutation(beginNight, {
		onSuccess: () => {
			queryClient.invalidateQueries(["games"]);
		},
		onError: (error) => {
			if (error instanceof Error) {
				callModal(error.message);
			}
		}
	});

	const startNight = (gameId: number) => {
		startNightMutation.mutate(gameId);
	};

	return (
		<React.Fragment>
			<PlayerList players={gameData.players} castVote={finishVote} isLobby={false} socket={socket} />
			{hasResult && votingResults ? <PlayerFocusCard player={votingResults} /> : null}
			{hasResult ? <GenericButton text="Start Night" onClick={() => startNight(gameData.game.id)} /> : <GenericButton text="End Round" onClick={endRound} />}
		</React.Fragment>
	);
};

export default DayTime;