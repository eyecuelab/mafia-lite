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

const getRoundById =async (id: number) => {
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
const killPlayer = async (votedPlayer : Player, roundId : number) => {
  // const round = await getRoundById(roundId);
  // round.died.push(player);
  // await prisma.round.update({
  //   where: { id: roundId },
  //   data: {
  //     died: round.died
  //   }
  // })
}
const endRound = async (roundId: number,) => {
  await prisma.round.update({
    where: { id: roundId },
    data: { 
      endedAt : new Date(),
    }
  })
}

export { getRoundByGameID, getRoundById, endRound, killPlayer, createNewRound }