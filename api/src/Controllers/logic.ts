import Utility from "./Utility";
import { createPlayer, getDeadPlayersByGameId, getPlayerById, getPlayersByGameId, updatePlayerById } from "../Models/player";
import assignRoles from "../Logic/assignRoles";
import { createNewRound, updateToNightPhase, getCurrentRoundByGameId, addGhostImage } from "../Models/round";
import { checkEndConditions, emitEndGame, emitStartDay, emitStartNight, getRandomLivingCultist, emitTimerTick } from "../Models/logic";
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
const DAYTIMER = 91000;
const NIGHTTIMER = 91000;
const ROUND_TIME = 90;

type VoteResult = {
	id: number
	count: number
  }

const logicControllers = {
	async startGame(req: any, res: any) {
		const { gameId } = req.body;
		const playerId = req.session.playerId;
		const timer = 180;
		
		if (Utility.validateInputs(res, "Invalid game or player id", gameId, playerId)) {
			const player = await getPlayerById(playerId);
			if(player.gameId !== gameId || !player.isHost) {
				return res.status(401).json({ error: "You are not allowed to start the game" });
			}
			// Checks player count to make sure there are enough players to start the game
			// const playerCountCheck = await getPlayersByGameId(gameId);
			// if(playerCountCheck.length < 6) {
			// 	return res.status(403).json({ error: "You need 6 players to start the game" });
			// }
			// await createNewRound(1, gameId);

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
				for (let j = 0; j < NUM_TRAITS_PER_PLAYER; j++) {
					await assignTrait(playerTraits[i][j], players[i].id);
				}
			}
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
	console.log("Starting day");
	const gameEndData = await checkEndConditions(gameId);
	if (gameEndData) {
		emitEndGame(gameId, gameEndData);
		// res.json({ message: `Game Over: ${gameEndData.cultistsWin ? "Cultists" : "Investigators"} win` });
	} else {
		const currentRound = await getCurrentRoundByGameId(gameId);
		await createNewRound((currentRound?.roundNumber ?? 0)  + 1, gameId);

		if (currentRound) {
			emitStartDay(gameId, currentRound.ghostImages);
		}
		
		setTimeout(async () => {
			await tallyVotes(gameId);
		}, DAYTIMER);

		let timeRemaining = ROUND_TIME;

    const intervalId = setInterval(async () => {
      emitTimerTick(gameId, timeRemaining);
      if (timeRemaining === 0) {
        clearInterval(intervalId);
      } else {
        timeRemaining = timeRemaining - 1;
      }
    }, 1000);
		// res.json({ message: "Day phase started" });
	}
}	// }
const startNight = async (gameId: number) => {
	console.log("Starting night");
		const gameEndData = await checkEndConditions(gameId);
		if (gameEndData) {
			emitEndGame(gameId, gameEndData);
		} else {
			const round = await getCurrentRoundByGameId(gameId);
			await updateToNightPhase(round.id);
			emitStartNight(gameId);
			setTimeout(async () => {
				await tallyVotes(gameId);
			}, NIGHTTIMER)
			let timeRemaining = ROUND_TIME;

			const intervalId = setInterval(async () => {
				emitTimerTick(gameId, timeRemaining);
				if (timeRemaining === 0) {
					clearInterval(intervalId);
				} else {
					timeRemaining = timeRemaining - 1;
				}
			}, 1000);
			const ghosts = await getDeadPlayersByGameId(gameId);
			for (let i = 0; i < ghosts.length; i++) {
				await createGhostTarget(gameId, ghosts[i].id);
			}
			// res.json({ message: "Night phase started" });
		}
	// }
}
const tallyVotes = async (gameId: number) => {
	const round = await getCurrentRoundByGameId(gameId);
	const votes = await getAllVotes(gameId, round.id, round.currentPhase);
	const players = await getPlayersByGameId(gameId);
	const isNight = round.currentPhase === "night";
	const voteResults = countVotes(players, votes);

	console.log("Calling tally votes: ", isNight);
		
	if(voteResults.length > 0 && voteResults[0].count !== voteResults[1].count) {
			try {
				await updateEndOfRoundStatus(gameId, voteResults[0].id);
				emitVoteResult(gameId, voteResults[0].id);
				setTimeout(async () => {
					if (isNight) {
						startDay(gameId);
					} else {
						startNight(gameId);	
					}
				}, 5000)
			} catch (error) {
				console.log(error)
			}
	}
	else {
		await unjailPrevJailedPlayer(gameId);
	  if(isNight)
	  {
		const chosenPlayer = await randomlyKillPlayer(gameId);
		await updateEndOfRoundStatus(gameId, chosenPlayer.id);
		await emitVoteResult(gameId, chosenPlayer.id, true);
		setTimeout(async () => {
			startDay(gameId);		
		}, 5000)
	  } else {
		  await emitVoteResult(gameId);
		  setTimeout(async () => {
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