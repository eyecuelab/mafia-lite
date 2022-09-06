import { Player } from '@prisma/client';
import { getGameById } from '../Models/game';
import { updatePlayerById, createPlayer, getPlayerById, getPlayersByGameId } from '../Models/player';
import { getRoleById } from '../Models/role';
import Utility from './Utility';

type filteredPlayer = {
	id: number,
	isHost: boolean,
	name: string,
	team?: string,
	gameId: number,
	roundDiedId: number | null,
	avatar: string
}

const playerControllers = {
	async createPlayer(req: any, res: any) {
		const { gameId, name, isHost } = req.body;

		if (Utility.validateInputs(res, "Invalid body parameters", gameId, name, isHost)) {
			const newPlayer = await createPlayer(gameId, isHost, name);

			req.session.playerId = newPlayer.id;
			res.status(201).json(newPlayer);
		}
	},

	async getSinglePlayer(req: any, res: any) {
		const { id } = req.query;

		if (Utility.validateInputs(res, "Invalid id", id)) {
			try {
				const player = await getPlayerById(id);
				const filteredPlayer = await filterPlayerData(req.session.playerId, player);
				
				res.json(filteredPlayer);
			} catch (error) {
				return res.status(404).json({ error: "Player not found" });
			}
		}
	},

	async getPlayers(req: any, res: any) {
		const { gameId } = req.params;

		if (Utility.validateInputs(res, "Invalid id", gameId)) {
			const players = await getPlayersByGameId(gameId);
			const filteredPlayers = filterPlayersData(req.session.playerId, players);
			res.json(filteredPlayers);
		}
	},

	async updatePlayer(req: any, res: any) {
		const { id, name } = req.body;

		if (Utility.validateInputs(res, "Invalid body parameters", id, name)) {
			const player = await updatePlayerById(id, name);
			res.json(player);
		}
	},

	async getPlayerGame(req: any, res: any) {
		const playerId = req.session.playerId;

		if (!playerId) {
			res.status(401).json({error: "Must join game through lobby"});
		} else {
			const player = await getPlayerById(playerId);
			const gameId = player.gameId;
			const game = await getGameById(gameId);
			const players = await getPlayersByGameId(gameId);
			const filteredPlayers = await filterPlayersData(playerId, players);

			res.json({game, players: filteredPlayers});
		}
	}
}

const filterPlayersData = async (playerId: number, players: Player[]) => {
	let filteredPlayers: filteredPlayer[] = [];
	
	for (let i = 0; i < players.length; i++) {
		filteredPlayers.push(await filterPlayerData(playerId, players[i]));
	}

	return filteredPlayers;
}

const filterPlayerData = async (playerId: number | undefined, player: Player): Promise<filteredPlayer> => {
	let role = undefined;
	if (playerId) {
		const requester = await getPlayerById(playerId);
		const requesterTeam = (await getRoleById(requester.roleId))?.type;

		if (requesterTeam === "cultist") {
			role = await getRoleById(player.roleId);
		}
	}
	
	return { id: player.id, isHost: player.isHost, name: player.name, team: role?.type, gameId: player.gameId, roundDiedId: player.roundDiedId, avatar: player.avatar };
}

export default playerControllers;