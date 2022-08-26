import { PrismaClient } from '@prisma/client';
import { createPlayer } from '../Models/player';
import { getAllGameDetails, createNewGame, getGameByGameCode } from "../Models/game";
import RoomCode from "../GenerateRoomCode";

const prisma = new PrismaClient();

const gameControllers = {
		async createGame(req: any, res: any) {
		const { name, isHost } = req.body;
		const gameCode = RoomCode.generate();
		const newGame = await createNewGame (gameCode)
		const newPlayer = await createPlayer(name, newGame.id, isHost)
		req.session.playerId = newPlayer.id
		console.log(newGame);
		res.status(201).json({ game: newGame, player: newPlayer });
	},

	async getGames(req: any, res: any) {
		const games = await prisma.game.findMany();
		res.json(games);
	},

	async getSingleGame(req: any, res: any) {
		const playerId = req.session.playerId;
		if(playerId === undefined) {
			return res.status(401).json({error : "Not a valid user"});
		}
		const { id } = req.params;
		try {
			const game = await getAllGameDetails(id)
			let isAPlayer = false;
			game?.players.map((player) => {
				if(player.id === playerId) isAPlayer = true;
			})
			if(!isAPlayer) return res.status(501).json({error : "You do not have access to this game."})
			res.json(game);
		}  catch (error) {
			return res.status(404).json({ error: "Game not found" });
		}
	},

	async joinGame(req: any, res: any) {
		const {name, gameCode} = req.body;
		const game = await getGameByGameCode(gameCode);
		const newPlayer = await createPlayer(name, game.id, false)
		req.session.playerId = newPlayer.id
		console.log(game);
	 	res.status(201).json({ game: game, player: newPlayer });
	}
}

export default gameControllers;