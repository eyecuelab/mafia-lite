import React from "react";
import socket from "../../Hooks/WebsocketHook";
import PlayerList from "../Lobby/PlayerList";
import PlayerFocusCard from "../PlayerFocusCard";
import GenericButton from "../../Components/GenericButton";
import { GameData, Player } from "../../Types/Types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../../ModalContext";
import { postData } from "../../ApiHelper";

const beginDay = async (gameId : number): Promise<void> => postData("/startDay", { gameId });

const NightTime = ({ gameData, hasResult, votingResults, finishVote, endRound }: { gameData: GameData, hasResult: boolean, votingResults?: Player, finishVote: (candidateId: number) => void, endRound: () => void }) => {
	const queryClient = useQueryClient();
	const { callModal } = useModal();

	const startDayMutation = useMutation(beginDay, {
		onSuccess: () => {
			queryClient.invalidateQueries(["games"]);
		},
		onError: (error) => {
			if (error instanceof Error) {
				callModal(error.message);
			}
		}
	});

	const startDay = (gameId: number) => {
		//startDayMutation.mutate(gameId);
		alert("start day");
	};

	return (
		<React.Fragment>
			<PlayerList players={gameData.players} castVote={finishVote} isLobby={false} socket={socket} />
			{hasResult && votingResults ? <PlayerFocusCard player={votingResults} /> : null}
			{hasResult ? <GenericButton text="Start Day" onClick={() => startDay(gameData.game.id)} /> : <GenericButton text="End Round" onClick={endRound} />}
		</React.Fragment>
	);
};

export default NightTime;