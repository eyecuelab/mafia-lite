import Utility from "./Utility";
import { getPlayerById, getPlayersByGameId, updatePlayerById } from "../Models/player";
import assignRoles from "../Logic/assignRoles";
import io from "../server";

const logicControllers = {
	async startGame(req: any, res: any) {
		const { gameId } = req.body;
		console.log("🚀 ~ file: logic.ts ~ line 9 ~ startGame ~ gameId", gameId)
		const playerId = req.session.playerId;
		console.log("🚀 ~ file: logic.ts ~ line 11 ~ startGame ~ playerId", playerId)

		if (Utility.validateInputs(res, "Invalid game or player id", gameId, playerId)) {
			const player = await getPlayerById(playerId);
			if(player.gameId !== gameId || !player.isHost) {
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
			const roles = await assignRoles(players.length);
			for (let i = 0; i < players.length; i++) {
				updatePlayerById(players[i].id, roles[i]);
			}

			res.json({ players: (await getPlayersByGameId(gameId)) });
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