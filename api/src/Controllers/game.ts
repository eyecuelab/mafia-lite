import { getGames, getAllGameDetails, createNewGame, getGameByGameCode } from "../Models/game";

const gameControllers = {
	async createGame(req: any, res: any) {
		const { name, size } = req.body;
		const newGame = await createNewGame(name, size);		
		
		res.status(201).json({ game: newGame });
	},

	async getGames(req: any, res: any) {
		res.json(getGames());
	},

	async getSingleGame(req: any, res: any) {
		const { gameId } = req.params;
		try {
			const game = await getAllGameDetails(gameId);
			res.json(game);
		} catch (error) {
			return res.status(404).json({ error: "Game not found" });
		}
	},

	async joinGame(req: any, res: any) {
		const { gameCode } = req.body;
		const game = await getGameByGameCode(gameCode);
		res.json({ game: game });
	}
}

export default gameControllers;