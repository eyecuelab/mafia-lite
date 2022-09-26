import Utility from "./Utility";
import { createPlayer, getDeadPlayersByGameId, getPlayerById, getPlayersByGameId, updatePlayerById } from "../Models/player";
import assignRoles from "../Logic/assignRoles";
import { createNewRound, updateToNightPhase, getCurrentRoundByGameId, addGhostImage } from "../Models/round";
import { checkEndConditions, emitEndGame, emitStartDay, emitStartNight, getRandomLivingCultist } from "../Models/logic";
import { getRolesbyType } from "../Models/role";
import { assignTrait, getTraits } from "../Models/traits";
import { getTraitsForGame } from "../Logic/assignTraits";
import { getGameById } from "../Models/game";
import { createGhostTarget, findGhostTarget } from "../Models/ghostTarget";
import { playerVote, emitVoteResult, getAllVotes } from "../Models/vote";
import { unjailPrevJailedPlayer, updateEndOfRoundStatus, randomlyKillPlayer } from "../Logic/changePlayerStatus";
import { Player, Vote } from "@prisma/client";
import io from '../server';

const NUM_TRAIT_REPEATS = 4;
const NUM_TRAITS_PER_PLAYER = 3;
const DAYTIMER = 20000;
const NIGHTTIMER = 20000;

type VoteResult = {
	id: number
	count: number
  }

const logicControllers = {
	async startGame(req: any, res: any) {
		console.log("🚀 ~ file: logic.ts ~ line 28 ~ startGame ~ Starting Game")
		const { gameId } = req.body;
		console.log("🚀 ~ file: logic.ts ~ line 30 ~ startGame ~ gameId", gameId)
		const playerId = req.session.playerId;
		console.log("🚀 ~ file: logic.ts ~ line 32 ~ startGame ~ playerId", playerId)
		const timer = 180;
		
		if (Utility.validateInputs(res, "Invalid game or player id", gameId, playerId)) {
			const player = await getPlayerById(playerId);
			if(player.gameId !== gameId || !player.isHost) {
				console.log("You are not allowed to start the game")
				return res.status(401).json({ error: "You are not allowed to start the game" });
			}
			console.log("About to create new Round")
			const round = await createNewRound(1, gameId);
			console.log("🚀 ~ file: logic.ts ~ line 43 ~ startGame ~ newRound", round.roundNumber)

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
			console.log("🚀 ~ file: logic.ts ~ line 56 ~ startGame ~ players", players)
			const roles = await assignRoles(players.length);
			console.log("🚀 ~ file: logic.ts ~ line 58 ~ startGame ~ roles", roles)
			const traits = await getTraits();
			console.log("🚀 ~ file: logic.ts ~ line 60 ~ startGame ~ traits", traits)
			const playerTraits = getTraitsForGame(traits, players.length, NUM_TRAIT_REPEATS, NUM_TRAITS_PER_PLAYER);
			console.log("🚀 ~ file: logic.ts ~ line 62 ~ startGame ~ playerTraits", playerTraits)

			if (process.env.FORCE_CULTIST === "true") {
				const cultistRoles = await getRolesbyType("cultist");
				roles[0] = cultistRoles[0].id;
			}

			for (let i = 0; i < players.length; i++) {
				await updatePlayerById(players[i].id, roles[i]);
				for (let j = 0; j < NUM_TRAITS_PER_PLAYER; j++) {
					await assignTrait(playerTraits[i][j], players[i].id);
				}
			}
			console.log("🚀 ~ file: logic.ts ~ line 73 ~ startGame ~ traits done/sending timer to client");
			io.in(gameId.toString()).emit('start_timer', timer);
			await startDay(gameId);
			res.json({ players: (await getPlayersByGameId(gameId)) });
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
			if (!ghostTarget || !ghostTarget.targetId) {
				res.status(404).send({ error: "Target not found" });
			} else {
				const target = await getPlayerById(ghostTarget?.targetId);
				res.json(target);
			}
		}
	
	}

}
export default logicControllers;
const startDay = async (gameId: number) => {
	console.log("Running START DAY")
	// const playerId = req.session.playerId;
	// const player = await getPlayerById(playerId);
	// if (!player) {
	// 	return res.status(401).json({ error: "You are not allowed to start the next round" });
	// } else {
	const gameEndData = await checkEndConditions(gameId);
	if (gameEndData) {
		console.log("🚀 ~ file: logic.ts ~ line 122 ~ startDay ~ game is over",)
		emitEndGame(gameId, gameEndData);
		// res.json({ message: `Game Over: ${gameEndData.cultistsWin ? "Cultists" : "Investigators"} win` });
	} else {
		const currentRound = await getCurrentRoundByGameId(gameId);
		console.log("🚀 ~ file: logic.ts ~ line 127 ~ startDay ~ currentRound", currentRound)
		const newRound = await createNewRound(currentRound.roundNumber + 1, gameId);
		console.log("🚀 ~ file: logic.ts ~ line 129 ~ startDay ~ newRound", newRound)

		emitStartDay(gameId, currentRound.ghostImages);
		console.log("settingTimer")
		setTimeout(async () => {
			console.log("🚀 ~ file: logic.ts ~ line 134 ~ startDay ~ Running Tally Votes")
			await tallyVotes(gameId);
		}, DAYTIMER)
		// res.json({ message: "Day phase started" });
	}
}	// }
const startNight = async (gameId: number) => {
	console.log("STARTING NIGHT")
	// const playerId = req.session.playerId;

	// if (Utility.validateInputs(res, "Invalid player id", playerId)) {
		// const player = await getPlayerById(playerId);
		// const gameId = player.gameId;

		// if(player.gameId !== gameId) {
		// 	return res.status(401).json({ error: "You are not allowed to start the night" });
		// }
		const gameEndData = await checkEndConditions(gameId);
		if (gameEndData) {
			console.log("🚀 ~ file: logic.ts ~ line 153 ~ startNight ~ game is over")
			emitEndGame(gameId, gameEndData);
			// res.json({ message: `Game Over: ${gameEndData.cultistsWin ? "Cultists" : "Investigators"} win` });
		} else {
			const round = await getCurrentRoundByGameId(gameId);
			console.log("🚀 ~ file: logic.ts ~ line 158 ~ startNight ~ round", round)
			const nightRound = await updateToNightPhase(round.id);
			console.log("🚀 ~ file: logic.ts ~ line 160 ~ startNight ~ nightRound", nightRound)

			emitStartNight(gameId);
			console.log("settingTimer")
			setTimeout(async () => {
				console.log("🚀 ~ file: logic.ts ~ line 165 ~ startNight ~ Running Tally Votes")
				await tallyVotes(gameId);
			}, NIGHTTIMER)
			const ghosts = await getDeadPlayersByGameId(gameId);
			console.log("🚀 ~ file: logic.ts ~ line 169 ~ startNight ~ ghosts", ghosts)
			for (let i = 0; i < ghosts.length; i++) {
				await createGhostTarget(gameId, ghosts[i].id);
			}
			console.log("Night phase started");
			// res.json({ message: "Night phase started" });
		}
	// }
}
const tallyVotes = async (gameId : number) => {
	console.log("Talling Votes ran")
	const round = await getCurrentRoundByGameId(gameId);
	console.log("🚀 ~ file: logic.ts ~ line 181 ~ tallyVotes ~ round", round)
	const votes = await getAllVotes(gameId, round.id, round.currentPhase);
	console.log("🚀 ~ file: logic.ts ~ line 183 ~ tallyVotes ~ votes", votes)
	const players = await getPlayersByGameId(gameId);
	console.log("🚀 ~ file: logic.ts ~ line 185 ~ tallyVotes ~ players", players)
	const isNight = round.currentPhase === "night";
	console.log("🚀 ~ file: logic.ts ~ line 187 ~ tallyVotes ~ isNight", isNight)
	const voteResults = countVotes(players, votes);
	console.log("🚀 ~ file: logic.ts ~ line 187 ~ tallyVotes ~ voteResults", voteResults)
		
	if(voteResults.length > 0 && voteResults[0].count !== voteResults[1].count) {
		console.log("Votes not equal to 0")
			try {
				await updateEndOfRoundStatus(gameId, voteResults[0].id);
				console.log("emitting vote result");
				emitVoteResult(gameId, voteResults[0].id);
				console.log("Setting Votes Results Timer")
				setTimeout(async () => {
					if(isNight) {
						console.log("🚀 ~ file: logic.ts ~ line 200 ~ setTimeout ~ Running start day", isNight)
						startDay(gameId);
					}else {
						console.log("🚀 ~ file: logic.ts ~ line 203 ~ setTimeout ~ Running start night", isNight)
						startNight(gameId);	
					}
				}, 5000)
			} catch (error) {
				console.log(error);
			}
	}
	else {
			console.log("Unjailing previous player")
			await unjailPrevJailedPlayer(gameId);
	  if(isNight)
	  {
		const chosenPlayer = await randomlyKillPlayer(gameId);
		await updateEndOfRoundStatus(gameId, chosenPlayer.id);
		console.log("Emitting Vote results");
		await emitVoteResult(gameId, chosenPlayer.id, true);
		setTimeout(async () => {
			console.log("🚀 ~ file: logic.ts ~ line 224 ~ setTimeout ~ Running start day")
			startDay(gameId);		
		}, 5000)
	  } else {
		  await emitVoteResult(gameId);
		  setTimeout(async () => {
			console.log("🚀 ~ file: logic.ts ~ line 224 ~ setTimeout ~ Running start Night")
			startNight(gameId);		
		}, 5000)
	  }
	}
  }
const countVotes = (players: Player[], votes: Vote[]) => {
	let voteResults: VoteResult[] = [];
	players.forEach((player) => {
		let playerVoteCount : number = 0;
		votes.forEach((vote) => {
			if(vote.candidateId === player.id) playerVoteCount++;
		})
		const voteResult = {id : player.id, count: playerVoteCount}
		voteResults.push(voteResult)
	});

	voteResults.sort((a: VoteResult, b: VoteResult) => {
		return b.count - a.count;
	});

	return voteResults;
}