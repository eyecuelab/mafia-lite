import { useQuery } from "@tanstack/react-query";
import { getData } from "../ApiHelper";
import { GameData } from "../Types/Types";

const getUserGameState = async (): Promise<GameData> => getData("/player/game");

function useGameStateQuery() {
	const { isLoading: gameQueryIsLoading, error: gameQueryError, data: gameData } = useQuery(["games"], getUserGameState);
	return { gameQueryIsLoading, gameQueryError, gameData };
}

export default useGameStateQuery;