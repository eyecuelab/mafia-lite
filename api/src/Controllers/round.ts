import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const roundControllers = {
	async getRounds(req: any, res: any) {
        const { gameId } = req.params;
		const rounds = await prisma.round.findUniqueOrThrow({
            where: {gameId : Number(gameId)}
        });
		res.json(rounds);
	},
	async getSingleRound(req: any, res: any) {
		const { id } = req.params;
		try {
			const round = await prisma.round.findUniqueOrThrow({
				where: { id: Number(id) },
			});
	
			res.json(round);
		}  catch (error) {
			return res.status(404).json({ error: "Round not found" });
		}
	}
}

export default roundControllers;