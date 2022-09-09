import { getPlayerById, getPlayersByGameId } from "../Models/player";
import { createVote, getAllVotes } from "../Models/vote";
import { getCurrentRoundByGameId } from "../Models/round";
import { updateEndOfRoundStatus } from "../Logic/changePlayerStatus";

type voteResult = {
  id: number
  count: number
}

const votingControllers = {
  async castVote(req: any, res: any) {
		const { gameId, candidateId, phase } = req.body;
    const player = await getPlayerById(req.session.playerId);
    if(req.session.playerId === undefined || player.gameId !== gameId) {
      res.status(401).json({error : "Not allowed to vote on this game"});
    } else {
			const currentRound = await getCurrentRoundByGameId(gameId);
			const votes = await getAllVotes(gameId, currentRound.id, phase);
			let voted = false;
			votes.forEach((vote) => {
				if(vote.voterId === player.id)
				{
					voted = true;
				}
			})
			if (voted) {
				res.status(500).json({error : "You have already voted"});
			} else {
				const vote = await createVote(gameId, phase, candidateId, player.id, currentRound.roundNumber);
				res.status(201).json({vote});
			}
		}
	},

  async tallyVotes(req: any, res: any) {
    const { gameId, phase } = req.body;
    //Tally Votes
		const round = await getCurrentRoundByGameId(gameId);
    const votes = await getAllVotes(gameId, round.id, phase);
    const players = await getPlayersByGameId(gameId);
    let voteResults: voteResult[] = [];
    players.forEach((player) => {
      let playerVoteCount : number = 0;
      votes.forEach((vote) => {
        if(vote.candidateId === player.id) playerVoteCount++;
      })
      const voteResult = {id : player.id, count: playerVoteCount}
      voteResults.push(voteResult)
    })

    voteResults.sort((a: voteResult, b: voteResult) => {
      return b.count - a.count;
    })

    if(voteResults.length === 1 || voteResults[0].count !== voteResults[1].count) {
      const player = await getPlayerById(voteResults[0].id);
			try {
				res.status(200).json((await updateEndOfRoundStatus(gameId, player)));
			} catch (error) {
				res.status(500).json({ error });
			}
    }
    else {
      res.status(200).json({ sentence: "Tie" });
    }
    
    // res.status(500).json({error : "Something went wrong"}) 
    // Save the voted player in round object
    // Communicate with clients
  }
}

export default votingControllers;