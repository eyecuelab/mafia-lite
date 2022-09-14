import Utility from "./Utility";
import { getPlayerById, getPlayersByGameId, updatePlayerById } from "../Models/player";
import assignRoles from "../Logic/assignRoles";
import io from "../server";
import { createNewRound, updateToNightPhase, getCurrentRoundByGameId } from "../Models/round";
import { emitStartNight } from "../Models/logic";

const logicControllers = {
	async startGame(req: any, res: any) {
		const { gameId } = req.body;
		console.log("GameId ", gameId)
		const playerId = req.session.playerId;

		if (Utility.validateInputs(res, "Invalid game or player id", gameId, playerId)) {
			const player = await getPlayerById(playerId);
			if(player.gameId !== gameId || !player.isHost) {
				return res.status(401).json({ error: "Your are not allowed to start the game" });
			}

			await createNewRound(1, gameId);

			const players = await getPlayersByGameId((gameId));
			const roles = await assignRoles(players.length);
			for (let i = 0; i < players.length; i++) {
				updatePlayerById(players[i].id, roles[i]);
			}

			res.json({ players: (await getPlayersByGameId(gameId)) });
		}
	},

	async startNight(req: any, res: any) {
		const playerId = req.session.playerId;

		if (Utility.validateInputs(res, "Invalid player id", playerId)) {
			const player = await getPlayerById(playerId);
			const gameId = player.gameId;

			if(player.gameId !== gameId) {
				return res.status(401).json({ error: "Your are not allowed to start the night" });
			}
			console.log("Night Starting ...")

			//Update Round Object
			const round = await getCurrentRoundByGameId(gameId)
			await updateToNightPhase(round.id)
			//Update Other Player Clients Night is starting
			emitStartNight(gameId);
			res.status(200);
		}
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

export default logicControllers;