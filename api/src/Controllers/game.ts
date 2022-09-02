import { createNewGame, getAllGameDetails, getGameByGameCode, getGames } from "../Models/game";
import Utility from "./Utility";

const minLobbySize = 4;
const maxLobbySize = 12;

const gameControllers = {
	async createGame(req: any, res: any) {
		const { name, size } = req.body;
		if (Utility.validateInputs(res, "Invalid lobby name or size", name, size)) {
			if (size > maxLobbySize || size < minLobbySize) {
				res.status(500).json({ error: `Lobby size outside allowed bounds (min: ${minLobbySize}, max: ${maxLobbySize})` });
			} else {
				const newGame = await createNewGame(name, size);
				res.status(201).json(newGame);
			}
		}
	},

	async getGames(req: any, res: any) {
		const games = await getGames();
		res.json(games);
	},

	async getSingleGame(req: any, res: any) {
		const { id, code } = req.query;
		try {
			let game;
			if (id) {
				game = await getAllGameDetails(parseInt(id));
			} else {
				game = await getGameByGameCode(code?.toUpperCase());
			}

			if (game) {
				if (game.players.length >= game.size) {
					res.status(500).json({ error: "Unable to join, lobby is full" });
				} else {
					res.json(game);
				}
			} else {
				res.status(500).json({ error: "Unable to retreive game" });
			}
		} catch (error) {
			res.status(404).json({ error: "Game not found" });
		}
	}
}

export default gameControllers;
