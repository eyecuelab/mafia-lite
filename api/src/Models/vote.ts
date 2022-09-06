import { PrismaClient } from '@prisma/client';
import { getRoundById } from './round';
const prisma = new PrismaClient();

const createVote = async (gameId: number, phase: string, candidateId: number, voterId: number, roundNumber: number) => {
    return await prisma.vote.create({
      data: {
              gameId : gameId,
              voterId: voterId,
              candidateId: candidateId,
              roundNumber: roundNumber,
              phase: phase
          }
    });
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
export {createVote, getAllVotes}