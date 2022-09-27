import { createNewGame, getAllGameDetails, getGameByGameCode, getGames, getGameById, deletePlayerFromGame } from "../Models/game";
import Utility from "./Utility";
import io from '../server';
import { Socket } from "socket.io";
import { disconnect } from "process";
import { getPlayerById } from "../Models/player";

const minLobbySize = 6;
const maxLobbySize = 12;

const gameControllers = {
	async createGame(req: any, res: any) {
		const { name, size } = req.body;
		if (Utility.validateInputs(res, "Invalid lobby name or size", name, size)) {
			if (size > maxLobbySize || size < minLobbySize) {
				res.status(403).json({ error: `Lobby size outside allowed bounds (min: ${minLobbySize}, max: ${maxLobbySize})` });
			} else {
				const newGame = await createNewGame(name, size);
				res.status(201).json(newGame);
			}
		}
	},

	async getGames(req: any, res: any) {
		const games = await getGames();
		res.json(games);
	},

	async playerLeaveGame(req: any, res: any) {
		const {id, gameId} = req.body;
		const playerId = req.session.playerId;
		if(playerId === undefined) res.status(401).json({error: 'You can only edit your own player'})
		const player = await getPlayerById(playerId);
		if(playerId !== id && !player.isHost){
			res.status(401).json({error: 'You can only edit your own player'})
		}
		const deletedPlayer = await deletePlayerFromGame(id);
		io.in(gameId.toString()).emit('player_left', deletedPlayer.id);
		io.in(gameId.toString()).emit('player_left_chat', deletedPlayer.name);
		if(!player.isHost){
			req.session.destroy();
		}
		res.status(200).json({message: "Removed Player"})
	},

	async endGameLeave(req: any, res: any) {
		const {id, gameId} = req.body;
		const playerId = req.session.playerId;
		if(playerId !== id || playerId === undefined){
			res.status(401).json({error: 'You can only edit your own player'})
		}
		req.session.destroy();
		res.status(200).json({message:"PlaYER HAS LEFT"})
	},

	async getSingleGame(req: any, res: any) {
		const { id, code } = req.query;
		try {
			let game;
			if (id) {
				game = await getAllGameDetails(parseInt(id));
			} else {
				game = await getGameByGameCode(code?.toUpperCase());
			}
			if (game) {
				if (game.players.length >= game.size) {
					res.status(401).json({ error: "Unable to join, lobby is full" });
				} else {
					res.json(game);
				}
			} else {
				res.status(401).json({ error: "Unable to retrieve game" });
			}
		} catch (error) {
			res.status(404).json({ error: "Game not found, Please enter a valid game code" });
		}
	}
}

export default gameControllers;
