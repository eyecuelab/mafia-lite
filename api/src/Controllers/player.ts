import { updatePlayerById, createPlayer, getPlayerById, getPlayersByGameId } from '../Models/player';

const playerControllers = {
	async createPlayer(req: any, res: any) {
		const { gameId, name, isHost } = req.body;
		const newPlayer = await createPlayer(gameId, isHost, name);

		req.session.playerId = newPlayer.id;
		res.status(201).json(newPlayer);
	},

	async getSinglePlayer(req: any, res: any) {
		const { id } = req.params;
		try {
			const player = await getPlayerById(id);
			res.json(player);
		} catch (error) {
			return res.status(404).json({ error: "Player not found" });
		}
	},

	async getPlayers(req: any, res: any) {
		const { gameId } = req.params;
		const players = await getPlayersByGameId(gameId);
		res.json(players);
	},

	async updatePlayer(req: any, res: any) {
		const { id, name } = req.body;
		const player = await updatePlayerById(id, name);
		res.json(player);
	}
}

export default playerControllers;