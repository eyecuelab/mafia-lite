import PlayerList from "../Lobby/PlayerList";
import GenericButton from "../../Components/GenericButton";
import { GameData, Player } from "../../Types/Types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../../ModalContext";
import { postData } from "../../ApiHelper";
import styles from "./Game.module.css";
import { TitleImage } from "../../assets/images/Images";

const beginDay = async (gameId: number): Promise<void> => postData("/startDay", { gameId });

const NightTime = ({ gameData, hasResult, finishVote, endRound, focusView }: { gameData: GameData, hasResult: boolean, votingResults?: Player, finishVote: (candidateId: number) => void, endRound: () => void, focusView: () => JSX.Element | null | undefined }) => {
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
		startDayMutation.mutate(gameId);
	};

	return (
		<div className={styles.gameScreenImage}>
			<div className={styles.gameScreenContainer}>
				<div className={styles.gameScreen}>
					<img src={TitleImage} className={styles.titleImage} alt="The Nameless Terror" />
					<h1>Night</h1>
					{gameData ? <PlayerList players={gameData.players} castVote={finishVote} isLobby={false} clientPlayer={gameData.thisPlayer} phase={"night"} /> : <p>...loading</p> }
					{hasResult ? <GenericButton text="Start Day" onClick={() => startDay(gameData.game.id)} /> : <GenericButton text="End Round" onClick={endRound} />}
				</div>
				<div className={styles.voteResultsNight}>
					{focusView()}
				</div>
			</div>
		</div> 
	);
};

export default NightTime;