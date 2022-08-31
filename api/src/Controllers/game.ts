import { getGames, getAllGameDetails, createNewGame, getGameByGameCode } from "../Models/game";
import { getPlayerById, getPlayersByGameId, updatePlayerById } from "../Models/player";
import io from "../server"

const minLobbySize = 4;
const maxLobbySize = 12;

const gameControllers = {
	async createGame(req: any, res: any) {
		const { name, size } = req.body;
		if (size > maxLobbySize || size < minLobbySize) {
			res.status(500).json({error: `Lobby size outside allowed bounds (min: ${minLobbySize}, max: ${maxLobbySize})`});
		} else {
			const newGame = await createNewGame(name, size);		
			res.status(201).json({ game: newGame });
		}
	},

	async getGames(req: any, res: any) {
		res.json(getGames());
	},

	async getSingleGame(req: any, res: any) {
		const { id, code } = req.query;		
		try {
			let game;
			if (id) {
				game = await getAllGameDetails(id);
			} else {
				game = await getGameByGameCode(code);
			}
			
			res.json(game);
		} catch (error) {
			return res.status(404).json({ error: "Game not found" });
		}
	},

	// async joinGame(req: any, res: any) {
	// 	const { gameCode } = req.body;
	// 	const game = await getGameByGameCode(gameCode);

	// 	if (game.players.length >= game.size) {
	// 		res.status(500).json({error: "Unable to join, lobby is full"});
	// 	} else {
	// 		res.json({ game: game });
	// 	}
	// },

	async startGame(req: any, res: any) {
		const { gameId } = req.params
		const playerId = req.session.playerId;
		const player = await getPlayerById(playerId);
		if(player.gameId !== gameId && !player.isHost)
		{
			return res.status(401).json({ error: "Your are not allowed to start the game" });
		}
		//Emit socket Message here
		//This might break
		io.on('connection', (socket: any) => {
			socket.to(gameId).emit("game_has_started");
		  });
		//Assign out Roles
		//May want to randomize players array before looping. 
		const players = await getPlayersByGameId((gameId));
		for (let i = 0; i < players.length; i++) {
			if (i % 3) {
				//assign cultist role
				await updatePlayerById(players[i].id, 2)
			} else {
				// assign investigator
				await updatePlayerById(players[i].id, 1)
			}
		}
		return res.status(204).json();
	},

	// async dayStart(req: any, res: any) {
	// 	//Create Round the object
	// 	//Set round object for correct phase
	// 	//Return the timer duration eventually
	// 	//Everyone is voting
	// },
	// async dayEnd(req: any, res: any) {
	// 	//Updating the round object
	// 	//Deciding who was jailed/terminated
	// 	//Send web socket message to the client to start night
	// },
	// async nightStart(req: any, res: any) {
	// 	//Create Round the object
	// 	//Set round object for correct phase
	// 	//Return the timer duration eventually 
	// 	//Ghosts/Cultists are voting
	// },
	// async nightEnd(req: any, res: any) {
	// 	//Updating the round object
	// 	//Deciding who was killed
	// 	//update killed player to ghost role
	// 	//Send web socket message to the client to start the next day
	// }
}

export default gameControllers;
