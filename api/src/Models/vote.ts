import { PrismaClient } from '@prisma/client';
import { filterPlayerData } from '../Controllers/player';
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
			phase: phase
    }
  });

  if (voteTally) {
    io.in(gameId.toString()).emit('vote_cast', candidateId, voteTally);
  }

	return vote;
}

const emitVoteResult = async(gameId: number, playerId?: number, randomKill?: boolean) => {
  if (!playerId) {
  	io.in(gameId.toString()).emit('vote_results_tie');
  } else if(randomKill) {
    const player = await getPlayerById(playerId);
		const filteredPlayer = await filterPlayerData(player.id, player);
  	io.in(gameId.toString()).emit('vote_results_tie_night', filteredPlayer);
  } else {
  	const player = await getPlayerById(playerId);
		const filteredPlayer = await filterPlayerData(player.id, player);
  	io.in(gameId.toString()).emit('vote_results', filteredPlayer);
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

export {createVote, getAllVotes, emitVoteResult};