import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const gameControllers = {
	async createGame(req: any, res: any) {
		const { hostId } = req.body;
		if (!hostId) {
			return res.status(500).json({ error: "Host required to start game"});
		}
	
		const host = await prisma.user.findUnique({
			where: { id: Number(hostId) },
		});
		if (!host) {
			return res.status(500).json({ error: "Host not found"});
		}
	
		const game = await prisma.game.create({
			data: {
				hostId
			}
		});
	
		res.json(game);
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