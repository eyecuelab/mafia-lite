import { getPlayerById, getPlayersByGameId } from "../Models/player";
import { playerVote, emitVoteResult, getAllVotes } from "../Models/vote";
import { getCurrentRoundByGameId } from "../Models/round";
import { unjailPrevJailedPlayer, updateEndOfRoundStatus, randomlyKillPlayer } from "../Logic/changePlayerStatus";
import { Player, Vote } from "@prisma/client";
import { getRolesbyType } from "../Models/role";

type VoteResult = {
  id: number
  count: number
}

const votingControllers = {
  async castVote(req: any, res: any) {
		const { gameId, candidateId } = req.body;
    const player = await getPlayerById(req.session.playerId);

    if(req.session.playerId === undefined || player.gameId !== gameId) {
      res.status(401).json({ error: "Not allowed to vote on this game" });
    } else {
			if (player.id === candidateId) {
				res.status(403).json({ error: "Cannot vote for oneself" });
			} else {
				const cultistRoles = await getRolesbyType("cultist");
				const cultistRoleIds = cultistRoles.map((role) => role.id);

				const candidate = await getPlayerById(candidateId);
				const candidateIsCultist = cultistRoleIds.includes(candidate.roleId ?? 1); // Temporary default to investigator

				const currentRound = await getCurrentRoundByGameId(gameId);
				if (candidateIsCultist && currentRound.currentPhase === "night") {
					res.status(403).json({ error: "Cannot vote to sacrafice cultist" });
				} else {
					const vote = await playerVote(gameId, currentRound.currentPhase, candidateId, player.id, currentRound.roundNumber);
					res.status(201).json({ vote });
				}
			}
		}
	},

  async tallyVotes(req: any, res: any) {
    const { gameId } = req.body;
		const round = await getCurrentRoundByGameId(gameId);
    const votes = await getAllVotes(gameId, round.id, round.currentPhase);
    const players = await getPlayersByGameId(gameId);
    const isNight = round.currentPhase === "night";
		const voteResults = countVotes(players, votes);
		
    if(voteResults.length > 0 && voteResults[0].count !== voteResults[1].count) {
			try {
				res.status(200).json((await updateEndOfRoundStatus(gameId, voteResults[0].id)));
				emitVoteResult(gameId, voteResults[0].id);
			} catch (error) {
				res.status(403).json({ error: "Unable to count vote results" });
			}
    }
    else {
			await unjailPrevJailedPlayer(gameId);
      if(isNight)
      {
        const chosenPlayer = await randomlyKillPlayer(gameId);
        res.status(200).json((await updateEndOfRoundStatus(gameId, chosenPlayer.id)));
        await emitVoteResult(gameId, chosenPlayer.id, true)
      } else {
        res.status(200).json({ sentence: "Tie" });
        await emitVoteResult(gameId);
      }
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

export default votingControllers;