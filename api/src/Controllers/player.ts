import { Player } from '@prisma/client';
import { getGameById } from '../Models/game';
import { updatePlayerById, createPlayer, getPlayerById, getPlayersByGameId, updatePlayerStatus, updatePlayerIsReady } from '../Models/player';
import { getRoleById, getRoleByName } from '../Models/role';
import { getCurrentRoundByGameId, getGhostImages } from '../Models/round';
import { getPlayerTraits } from '../Models/traits';
import io from '../server';
import Utility from './Utility';

export type FilteredPlayer = {
	id: number
	isHost: boolean
	name: string
	team?: string
	gameId: number
	roundDiedId: number | null
	status: string
	traits: string[]
	avatar: string
	isReady: boolean 
	isDisconnected: boolean
}

const playerControllers = {
	async createPlayer(req: any, res: any) {
		const { gameId, name, isHost, socketId } = req.body;

		if (Utility.validateInputs(res, "Invalid body parameters", gameId, name, isHost)) {
			const newPlayer = await createPlayer(gameId, isHost, name);
			req.session.playerId = newPlayer.id;

			io.to(gameId.toString()).emit("player_joined_lobby", newPlayer.id);
			io.to(gameId.toString()).emit("player_joined_lobby_chat", name);
			res.status(201).json(newPlayer);
		}
	},

	async getSinglePlayer(req: any, res: any) {
		const { id } = req.query;

		if (Utility.validateInputs(res, "Invalid id", id)) {
			try {
				const player = await getPlayerById(id);
				const filteredPlayer = await filterPlayerData(req.session.playerId, player);
				
				res.status(200).json(filteredPlayer);
			} catch (error) {
				return res.status(404).json({ error: "Player not found" });
			}
		}
	},

	async getPlayers(req: any, res: any) {
		const { gameId } = req.params;

		if (Utility.validateInputs(res, "Invalid id", gameId)) {
			const players = await getPlayersByGameId(gameId);
			const filteredPlayers = await filterPlayersData(req.session.playerId, players);
			res.status(200).json(filteredPlayers);
		}
	},

	async updatePlayer(req: any, res: any) {
		const { id, newRoleName, newStatus} = req.body;
		if (newRoleName) {
			const newRole = await getRoleByName(newRoleName);
			if (newRole) {
				await updatePlayerById(id, newRole?.id);
			} else {
				res.status(403).json({ error: "Unable to find role" });
			}
		}

		if (newStatus) {
			await updatePlayerStatus(id, newStatus);
		}
		res.status(200).json({ message: "Updated" });
	},

	async getPlayerGame(req: any, res: any) {
		const playerId = req.session.playerId;
		if (!playerId) {
			res.status(401).json({error: "Must join game through lobby"});
		} else {
			try {
				const player = await getPlayerById(playerId);
				if (!player) {
					res.status(404).send({ error: "Player not found" });
				} else {
					const gameId = player.gameId;
					const game = await getGameById(gameId);
					const players = await getPlayersByGameId(gameId);
					const filteredPlayers = await filterPlayersData(playerId, players);
					const currentRound = await getCurrentRoundByGameId(gameId);
					const ghostImages = (await getGhostImages(gameId)) ?? [];
	
					try {
						const filteredPlayer = await filterPlayerData(playerId, player);
						res.json({ game, players: filteredPlayers, thisPlayer: filteredPlayer, currentRound, ghostImages });
					} catch (error) {
						console.log(error instanceof Error ? error.message : error);
						res.status(404).send({ error: "Player not found "});
					}
				}
			} catch (error) {
				console.log(error instanceof Error ? error.message : error);
				res.status(404).send({ error: "Player not found "});
			}
		}
	},
	async playerIsReady(req: any, res: any) {
		const playerId = req.session.playerId;
		const { id, isReady } = req.body;
		if (playerId !== id) {
			res.status(401).json({error: "You can only ready your own player"});
		} else {
			const player = await getPlayerById(playerId);
			const gameId = player.gameId;
			const updatedPlayer = await updatePlayerIsReady(player.id, isReady);
			io.in(gameId.toString()).emit('playerIsReady');
			res.status(200).json({updatedPlayer});
		}
	}
}

export const filterPlayersData = async (requesterId: number, players: Player[]) => {
	let filteredPlayers: FilteredPlayer[] = [];
	
	for (let i = 0; i < players.length; i++) {
		filteredPlayers.push(await filterPlayerData(requesterId, players[i]));
	}

	return filteredPlayers;
}

export const filterPlayerData = async (requesterId: number, player: Player): Promise<FilteredPlayer> => {
	let role = undefined;
	const requester = await getPlayerById(requesterId);
	if (!requester) {
		throw new Error("Requester not found");
	}

	const requesterTeam = (await getRoleById(requester.roleId))?.type;

	if (requesterTeam === "cultist" || requesterId === player.id) {
		role = await getRoleById(player.roleId);
	}

	const traits = await getPlayerTraits(player.id);
	
	return { id: player.id, isHost: player.isHost, name: player.name, team: role?.type, gameId: player.gameId, roundDiedId: player.roundDiedId, status: player.status, traits, avatar: player.avatar, isReady: player.isReady, isDisconnected: player.isDisconnected };
}

export default playerControllers;