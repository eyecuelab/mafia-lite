import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const gameControllers = {
	async createGame(req: any, res: any) {
		const { hostId, name } = req.body;
		if (!hostId) {
			if (!name) {
				return res.status(400).json({ error: "Hostid or new Username required to start game"});
			}
			
			const newUser = await prisma.user.create({
				data: {
					name: name
				},
			});

			const newGame = await prisma.game.create({
				data: {
					hostId: newUser.id
				}
			});

			res.json({ userId: newUser.id, game: newGame });
		} else {
			const host = await prisma.user.findUnique({
				where: { id: Number(hostId) }
			});
			if (!host) {
				return res.status(500).json({ error: "Host not found"});
			}

			const newGame = await prisma.game.create({
				data: {
					hostId: hostId
				}
			});

			res.status(201).json(newGame);
		}
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