import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const roundControllers = {
	async getGameSettings(req: any, res: any) {
		const { gameId } = req.params;
        try {
            const gameSettings = await prisma.gameSettings.findUniqueOrThrow({
                where: { gameId : Number(gameId) }
            });
            res.json(gameSettings);
        }
        catch(error) {
            return res.status(404).json({ error: "Game Settings not Found" });
        }
	},
	
	async updateGameSettings(req: any, res: any) {
        //Check session to make sure user is the host
        const { id, dayDuration, nightDuration } = req.body
        const gameSettings = await prisma.gameSettings.update({
            where: { id: Number(id) },
            data: { dayDuration : dayDuration, nightDuration : nightDuration },
        })
        res.json(gameSettings)
	},

    // async createGameSettings(req: any, res: any) {
    //     //Check session to make sure user is the host
    //     const DEFAULT_DAY_DURATION = 180;
    //     const DEFAULT_NIGHT_DURATION = 180;
	// 	const { gameId } = req.params;
    //     const game = await prisma.game.findUnique({
    //         where: { id: Number(gameId) }
    //     });
    //     if (!game) {
    //         return res.status(500).json({ error: "Game not found"});
    //     }
    //     const gameSettings = await prisma.gameSettings.create({
    //         data: { 
    //             game : game,
    //             dayDuration: DEFAULT_DAY_DURATION,
    //             nightDuration: DEFAULT_NIGHT_DURATION
    //          },
    //     })
    //     res.status(201).json(gameSettings);
	// }
}

export default roundControllers;
