import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getRoundByGameID = async (gameId: number) => {
  return await prisma.round.findMany({
    where: { gameId: Number(gameId)}
  });
}

const getRoundById =async (id: number) => {
  try {
    return await prisma.round.findUniqueOrThrow ({
      where: { id: Number(id)}
    })
  } catch (error) {
    throw "Round not found";
  }
}

export { getRoundByGameID, getRoundById}