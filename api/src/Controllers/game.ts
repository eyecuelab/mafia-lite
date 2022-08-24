import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const gameControllers = {
	async createGame(req: any, res: any) {
		const { name, isHost } = req.body;
		const newGame = await prisma.game.create({
			data: {}
		});

		const newPlayer = await prisma.player.create({
			data: {
				name: name,
				isHost: isHost,
				gameId: newGame.id
			},
		});

		res.status(201).json({ game: newGame, player: newPlayer });
	},

	async getGames(req: any, res: any) {
		const games = await prisma.game.findMany();
		res.json(games);
	},

	async getSingleGame(req: any, res: any) {
		const { id } = req.params;
	
		try {
			const game = await prisma.game.findUniqueOrThrow({
				where: { id: Number(id) },
			});
	
			res.json(game);
		}  catch (error) {
			return res.status(404).json({ error: "Game not found" });
		}
	}
}

export default gameControllers;