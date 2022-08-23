import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const playerControllers = {
	async getSinglePlayer(req: any, res: any) {
		const { id } = req.params;
		try {
			const player = await prisma.player.findUniqueOrThrow({
				where: { id: Number(id) },
			});
	
			res.json(player);
		}  catch (error) {
			return res.status(404).json({ error: "Player not found" });
		}
	},

  async getPlayers(req: any, res: any) {
        const { gameId } = req.params;
		const players = await prisma.player.findMany({
            where: {gameId : Number(gameId)}
        });
		res.json(players);
	},

	async createPlayer(req: any, res: any) {
		const { userId, gameId } = req.body;
		if (!userId) {
			return res.status(500).json({ error: "User needed to create in-game player"});
		} else if (!gameId) {
			return res.status(500).json({ error: "A Game needs to be created"});
		}

		const user = await prisma.user.findUnique({
			where: { id: Number(userId)},
		});
		if (!user) {
			return res.status(500).json({ error: "User not found"})
		}
		
		const player = await prisma.player.create({
			data: {
				userId,
				gameId,
			}
		});

		res.json(player);
	} 
}

export default playerControllers;