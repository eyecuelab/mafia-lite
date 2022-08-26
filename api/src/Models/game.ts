import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getGames = async () => {
  return await prisma.game.findMany()
}

const getGameById = async (id: number) => {
  try {
    return await prisma.game.findUniqueOrThrow({
      where: { id: Number(id) },
    });
  } catch (error) {
    throw "Game not found"
  }
}

const getAllGameDetails = async (id: number) => {
  return await prisma.game.findUnique({
    where: { id: Number(id) },
    include: {
      players: true,
      rounds: true
    }
  });
}

const createNewGame = async (gameCode: string) => {
  return await prisma.game.create({
    data: { gameCode: gameCode }
  });
}

const getGameByGameCode = async (gameCode: string) => {
  try {
    return await prisma.game.findUniqueOrThrow({
      where: { gameCode: gameCode },
      include: {
        players: true,
        rounds: true
      }
    })
  }
  catch {
    throw "Game not found";
  }
}

export { getGames, getGameById, getAllGameDetails, createNewGame, getGameByGameCode }