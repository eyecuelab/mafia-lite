import { PrismaClient } from '@prisma/client';
import { updatePlayerById } from '../Models/player';
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

	async updatePlayer(req: any, res: any) {
		const { id, name } = req.body;
		const player = updatePlayerById(id, name);
		res.json(player);
	}
}

export default playerControllers;