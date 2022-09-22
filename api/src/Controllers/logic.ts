import Utility from "./Utility";
import { createPlayer, getDeadPlayersByGameId, getPlayerById, getPlayersByGameId, updatePlayerById } from "../Models/player";
import assignRoles from "../Logic/assignRoles";
import { createNewRound, updateToNightPhase, getCurrentRoundByGameId, addGhostImage } from "../Models/round";
import { checkEndConditions, emitEndGame, emitStartDay, emitStartNight, getRandomLivingCultist } from "../Models/logic";
import { getRolesbyType } from "../Models/role";
import { assignTrait, getTraits } from "../Models/traits";
import { getTraitsForGame } from "../Logic/assignTraits";
import { getGameById } from "../Models/game";
import { filterPlayerData } from "./player";
import { createGhostTarget, findGhostTarget } from "../Models/ghostTarget";

const NUM_TRAIT_REPEATS = 2;
const NUM_TRAITS_PER_PLAYER = 3;

const logicControllers = {
	async startGame(req: any, res: any) {
		const { gameId } = req.body;
		const playerId = req.session.playerId;

		if (Utility.validateInputs(res, "Invalid game or player id", gameId, playerId)) {
			const player = await getPlayerById(playerId);
			if(player.gameId !== gameId || !player.isHost) {
				return res.status(401).json({ error: "You are not allowed to start the game" });
			}

			await createNewRound(1, gameId);

			if(process.env.CREATE_FULL_LOBBY === "true") {
				const checkPlayers = await getPlayersByGameId((gameId));
				const game = (await getGameById(gameId))!;
				if (checkPlayers.length < game.size) {
					for (let i = checkPlayers.length; i < 12; i++) {
						await createPlayer(gameId, false, i.toString());
					}
				}
			}

			const players = await getPlayersByGameId((gameId));
			const roles = await assignRoles(players.length);
			const traits = await getTraits();
			const playerTraits = getTraitsForGame(traits, players.length, NUM_TRAIT_REPEATS, NUM_TRAITS_PER_PLAYER);

			if (process.env.FORCE_CULTIST === "true") {
				const cultistRoles = await getRolesbyType("cultist");
				roles[0] = cultistRoles[0].id;
			}

			for (let i = 0; i < players.length; i++) {
				await updatePlayerById(players[i].id, roles[i]);
				for (let j = 0; j < 3; j++) {
					await assignTrait(playerTraits[i][j], players[i].id);
				}
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
				return res.status(401).json({ error: "You are not allowed to start the night" });
			}

			const gameEndData = await checkEndConditions(gameId);
			if (gameEndData) {
				emitEndGame(gameId, gameEndData);
				res.json({ message: `Game Over: ${gameEndData.cultistsWin ? "Cultists" : "Investigators"} win` });
			} else {
				const round = await getCurrentRoundByGameId(gameId);
				await updateToNightPhase(round.id);

				emitStartNight(gameId);
				const ghosts = await getDeadPlayersByGameId(gameId);
				for (let i = 0; i < ghosts.length; i++) {
					await createGhostTarget(gameId, ghosts[i].id);
				}

				res.json({ message: "Night phase started" });
			}

			
		}
	},

	async startDay(req: any, res: any) {
		const playerId = req.session.playerId;
		const player = await getPlayerById(playerId);
		if (!player) {
			return res.status(401).json({ error: "You are not allowed to start the next round" });
		} else {
			const gameEndData = await checkEndConditions(player.gameId);
			if (gameEndData) {
				emitEndGame(player.gameId, gameEndData);
				res.json({ message: `Game Over: ${gameEndData.cultistsWin ? "Cultists" : "Investigators"} win` });
			} else {
				const currentRound = await getCurrentRoundByGameId(player.gameId);
				await createNewRound(currentRound.roundNumber + 1, player.gameId);

				emitStartDay(player.gameId, currentRound.ghostImages);
				res.json({ message: "Day phase started" });
			}
		}
	},

	async submitGhostImage(req: any, res: any) {
		const { imgIndex } = req.body;
		const playerId = req.session.playerId;
		const player = await getPlayerById(playerId);
		if (!player) {
			res.status(401).json({ error: "You are not allowed to send images" });
		} else {
			await addGhostImage(player.gameId, imgIndex);
			res.json({ message: "Image submitted" });
		}
	},

	async getGhostTarget(req: any, res: any) {
		const playerId = req.session.playerId;
		const player = await getPlayerById(playerId);
		if (!player || (player.status !== "terminated" && player.status !== "murdered")) {
			res.status(401).json({ error: "You are not a ghost" });
		} else {
			const ghostTarget = await findGhostTarget(playerId);
			const target = await getPlayerById(ghostTarget?.targetId);

			res.json(target);
		}
	}
}

export default logicControllers;