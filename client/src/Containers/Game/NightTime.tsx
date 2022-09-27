import { GameData, Player } from "../../Types/Types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../../ModalContext";
import { postData } from "../../ApiHelper";
import styles from "./Game.module.css";
import { TitleImage } from "../../assets/images/Images";
import GamePlayerList from "./PlayerList/GamePlayerList";
import Timer from "../../Components/Timer/Timer";
import Rules from "../../Components/Rules/Rules";

type NightTimeProps = {
  gameData: GameData,
  hasResult: boolean,
  votingResults?: Player,
  timeRemaining: number,
  castVote: (candidateId: number) => void,
  endRound: () => void,
  focusView: () => JSX.Element | null | undefined,
}

const beginDay = async (gameId: number): Promise<void> => postData("/startDay", { gameId });

const NightTime: React.FC<NightTimeProps> = ({ gameData, hasResult, castVote, endRound, focusView, timeRemaining }) => {
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
		<div className={styles.gameScreenImageNight}>
			<div className={styles.gameScreenContainer}>
				<div className={styles.gameScreen}>
					<img src={TitleImage} className={styles.titleImage} alt="The Nameless Terror" />
					<div className={styles.roundTimerContainer}>
						<h1 className={styles.nightHeader}>Night {gameData?.currentRound?.roundNumber}</h1>
						<Timer timeRemaining={timeRemaining}/>
					</div>
					{gameData ? <GamePlayerList castVote={castVote} hasResult={hasResult} /> : <p>...loading</p> }
				</div>
				<div className={styles.voteResultsNight}>
					{focusView()}
				</div>
			</div>
		</div> 
	);
};

export default NightTime;