import { getRoundByGameID, getRoundById } from "../Models/round";

const roundControllers = {
	async getRounds(req: any, res: any) {
		const { gameId } = req.params;
		const rounds = await getRoundByGameID(gameId);
		res.json(rounds);
	},

	async getSingleRound(req: any, res: any) {
		const { id } = req.params;
		try {
			const round = await getRoundById(id);
			res.json(round);
		} catch (error) {
			return res.status(404).json({ error: "Round not found" });
		}
	}
}

export default roundControllers;