import { createPlayer } from '../Models/player';
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
		const playerId = req.session.playerId;
		if (playerId === undefined) {
			return res.status(401).json({ error: "Not a valid user" });
		}
		
		const { gameId } = req.params;
		try {
			const game = await getAllGameDetails(gameId);
			let isAPlayer = false;
			game?.players.map((player) => {
				if (player.id === playerId) isAPlayer = true;
			});

			if(!isAPlayer) return res.status(401).json({error : "You do not have access to this game."})
			res.json(game);
		} catch (error) {
			return res.status(404).json({ error: "Game not found" });
		}
	},

	async joinGame(req: any, res: any) {
		const { name, gameCode, avatar } = req.body;

		const game = await getGameByGameCode(gameCode);
		const newPlayer = await createPlayer(game.id, false);

		req.session.playerId = newPlayer.id;
		res.status(201).json({ game: game, player: newPlayer });
	}
}

export default gameControllers;