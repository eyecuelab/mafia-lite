import { getAllGameDetails } from "../Models/game";
import { getPlayerById, getPlayersByGameId } from "../Models/player";
import {createVote, getAllVotes} from "../Models/vote";
import { getRoundByGameID, getCurrentRoundByGameId } from "../Models/round";

type voteResult = {
  id: number
  count: number
}
const votingControllers = {
  async castVote(req: any, res: any) {
		const { gameId, candidateId, phase } = req.body;
    const player = await getPlayerById(req.session.playerId);
    if(req.session.playerId === undefined || player.gameId !== gameId) {
      res.status(401).json({error : "Not allowed to vote on this game"})
    }

    const currentRound = await getCurrentRoundByGameId(gameId);
    const votes = await getAllVotes(gameId, currentRound.id, phase);
    votes.forEach((vote) => {
      if(vote.voterId === player.id)
      {
        res.status(500).json({error : "You have already voted"}) 
      }
    })
    const vote = await createVote(gameId, phase, candidateId, player.id, currentRound.roundNumber);

    res.status(201).json({vote})
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

    voteResults.sort((a : voteResult, b : voteResult) => {
      return b.count - a.count;
    })
    console.log(voteResults);

    if(voteResults.length === 1) {
      const player = await getPlayerById(voteResults[0].id)
      res.status(200).json(player.name) 
    }
    else if(voteResults[0].count === voteResults[1].count) res.status(200).json("Tie") 
    else {
      const player = await getPlayerById(voteResults[0].id)
      res.status(200).json(player.name) 
    }
    
    // res.status(500).json({error : "Something went wrong"}) 
    //Save the voted player in round object
    //Communicate with clients
  }
} 

export default votingControllers;