import GenericButton from "../../Components/GenericButton";
import PlayerList from "../Lobby/PlayerList";
import { GameData, Player } from "../../Types/Types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../../ModalContext";
import { postData } from "../../ApiHelper";
import styles from "./Game.module.css";
import { TitleImage } from "../../assets/images/Images";

const beginNight = async (gameId: number): Promise<void> => postData("/startNight", { gameId });

const DayTime = ({ gameData, hasResult, finishVote, endRound, focusView }: { gameData: GameData, hasResult: boolean, votingResults?: Player, finishVote: (candidateId: number) => void, endRound: () => void, focusView: () => JSX.Element | null | undefined }) => {
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
		<div className={styles.gameScreenImage}>
			<div className={styles.gameScreenContainer}>
				<div className={styles.gameScreen}>
					<img src={TitleImage} className={styles.titleImage} alt="The Nameless Terror" />
					<h1>Day</h1>
					{gameData ? <PlayerList players={gameData.players} castVote={finishVote} isLobby={false} clientPlayer={gameData.thisPlayer} phase={"day"} /> : <p>...loading</p> }
					{hasResult ? <GenericButton text="Start Night" onClick={() => startNight(gameData.game.id)} /> : <GenericButton text="End Round" onClick={endRound} />}
				</div>
				{/* // <div className={styles.voteResults}>
				// 	{hasResult && votingResults ? <PlayerFocusCard player={votingResults} tie={false} /> : null}
				// 	{hasResult && !votingResults ? <PlayerFocusCard player={undefined} tie={true} /> : null} */}
				<div className={styles.voteResultsNight}>
					{focusView()}
				</div>
			</div>
		</div> 
	);
};

export default DayTime;

