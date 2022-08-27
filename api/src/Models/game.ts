import { PrismaClient } from '@prisma/client';
import RoomCode from '../GenerateRoomCode';
const prisma = new PrismaClient();

export type CreateGameInput = {
	name: string,
	size: number
}

const getGames = async () => {
  return await prisma.game.findMany();
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

const createNewGame = async (gameInput : CreateGameInput) => {
  return await prisma.game.create({
    data: {
			gameCode : RoomCode.generate(),
			name: gameInput.name,
			size: gameInput.size
		}
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
    });
  }
  catch {
    throw "Game not found";
  }
}

export { getGames, getGameById, getAllGameDetails, createNewGame, getGameByGameCode };