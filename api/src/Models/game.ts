import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getGames = async () => {
  return await prisma.game.findMany()
}

const getGameById =async (id: number) => {
  try{
    return await prisma.game.findUniqueOrThrow ({
      where: { id: Number(id) },
    });
  } catch (error) {
    throw "Game not found"
  }
}

export { getGames, getGameById }