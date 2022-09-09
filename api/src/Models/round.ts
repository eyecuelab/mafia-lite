import { Player, PrismaClient } from '@prisma/client';
import { getPlayerById } from './player';
const prisma = new PrismaClient();

const createNewRound = async (roundNumber: number, gameId: number) => {
	return await prisma.round.create({
		data: {
			gameId,
			roundNumber
		}
	});
}

const getRoundByGameID = async (gameId: number) => {
  return await prisma.round.findMany({
    where: { gameId: Number(gameId)}
  });
}

const getRoundById = async (id: number) => {
  try {
    return await prisma.round.findUniqueOrThrow ({
      where: { id: Number(id)},
      include: {
        died: true
      }
      
    })
  } catch (error) {
    throw "Round not found";
  }
}
const killPlayer = async (votedPlayer: Player, roundId: number) => {
	//return await prisma.
}
const endRound = async (roundId: number,) => {
  return await prisma.round.update({
    where: { id: roundId },
    data: { 
      endedAt : new Date(),
    }
  })
}

const getCurrentRoundByGameId = async (gameId: number) => {
	const rounds = await prisma.round.findMany({
		where: { gameId },
		orderBy: { roundNumber: "desc" }
	});

	return rounds[0];
}

export { getRoundByGameID, getRoundById, endRound, killPlayer, createNewRound, getCurrentRoundByGameId }