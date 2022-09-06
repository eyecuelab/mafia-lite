import { getAllGameDetails } from "../Models/game";
import { getPlayerById, getPlayersByGameId } from "../Models/player";
import {createVote, getAllVotes} from "../Models/vote";
import { getRoundByGameID, killPlayer } from "../Models/round";


const votingControllers = {
    async castVote(req: any, res: any) {
		const { gameId, candidateId, phase } = req.body;
        const player = await getPlayerById(req.session.playerId);
        if(req.session.playerId === undefined || player.gameId !== gameId) {
            res.status(401).json({error : "Not allowed to vote on this game"})
        }
        //Need to create a way to get the current round.
        const currentRound = 1;
        const vote = createVote(gameId, phase, candidateId, player.id, currentRound);

        res.status(201).json({vote})
	},

    async tallyVotes(req: any, res: any) {
        const { gameId, roundId, phase } = req.params;
        //Tally Votes
        const votes = await getAllVotes(gameId, roundId, phase);
        const players = await getPlayersByGameId(gameId);
        let voteResults = [];
        players.forEach((player) => {
            let playerVoteCount : number = 0;
            votes.forEach((vote) => {
                if(vote.candidateId === playerVoteCount) playerVoteCount++;
            })
            const voteResult = {id : player.id, count: playerVoteCount}
            voteResults.push(voteResult)
        })
        //Save the voted player in round object
        //Communicate with clients
    }
} 

export default votingControllers;