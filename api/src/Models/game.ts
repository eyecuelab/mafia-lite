import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getGames = async () => {
  return await prisma.game.findMany()
}

const getGameById = async (id: number) => {
  try{
    return await prisma.game.findUniqueOrThrow ({
      where: { id: Number(id) },
    });
  } catch (error) {
    throw "Game not found"
  }
}

const getAllGameDetails = async (id: number) => {
  return await prisma.game.findUnique ({
    where: { id: Number(id) },
    include: {
      players : true,
      rounds: true
    }
  });
}

const createNewGame = async (name: string, isHost: boolean) => {
  return await prisma.game.create({
    data: {}
  });
}

export { getGames, getGameById, getAllGameDetails, createNewGame }