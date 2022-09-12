import { PrismaClient } from '@prisma/client';
import io from '../server';
import { getPlayerById } from './player';
import { getRoundById } from './round';
const prisma = new PrismaClient();

const createVote = async (gameId: number, phase: string, candidateId: number, voterId: number, roundNumber: number) => {
    const vote = await prisma.vote.create({
      data: {
        gameId : gameId,
        voterId: voterId,
        candidateId: candidateId,
        roundNumber: roundNumber,
        phase: phase
      }
    });

    const voteTally = await prisma.vote.count({
      where: {
        gameId: gameId,
        candidateId: candidateId,
        roundNumber: roundNumber,
      }
    });

    if (voteTally) {
			console.log(`casting vote -> ${candidateId}, total: ${voteTally}`);
      io.in(gameId.toString()).emit('vote_cast', candidateId, voteTally);
    }

    return vote;
  }

const emitVoteResult = async(playerId: number, gameId: number) => {
  if(playerId === 0) {
    io.in(gameId.toString()).emit('vote_results_tie')
  }else {
    const player = await getPlayerById(playerId)
    io.in(gameId.toString()).emit('vote_results', player)
  }
}
const getAllVotes = async (gameId: number, roundId: number, phase: string) => {
    const round = await getRoundById(roundId)
    return await prisma.vote.findMany({
        where :{
            gameId : Number(gameId),
            roundNumber : round.roundNumber,
            phase : phase
        }
    })
}
export {createVote, getAllVotes, emitVoteResult}