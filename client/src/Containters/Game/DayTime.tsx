import PlayerFocusCard from "../PlayerFocusCard";
import GenericButton from "../../Components/GenericButton";
import PlayerList from "../Lobby/PlayerList";
import { GameData, Player } from "../../Types/Types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../../ModalContext";
import { postData } from "../../ApiHelper";
import styles from "./Game.module.css";
import titleImg from "../../assets/images/Title.png";


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
		<div className={styles.gameScreenImage}>
			<div className={styles.gameScreenContainer}>
				<div className={styles.gameScreen}>
					<img src={titleImg} className={styles.titleImage} alt="The Nameless Terror" />
					<h1>Day</h1>
					{gameData ? <PlayerList players={gameData.players} castVote={finishVote} isLobby={false} team={gameData.thisPlayer.team} phase={"day"} isAlive={gameData.thisPlayer.status === "alive"} /> : <p>...loading</p> }
					{hasResult ? <GenericButton text="Start Night" onClick={() => startNight(gameData.game.id)} /> : <GenericButton text="End Round" onClick={endRound} />}
				</div>
				<div className={styles.voteResults}>
					{hasResult && votingResults ? <PlayerFocusCard player={votingResults} /> : null}
				</div>
			</div>
		</div> 
	);
};

export default DayTime;

