import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getPlayerById = async (id: number) => {
  try {
     return await prisma.player.findUniqueOrThrow({
        where: { id: Number(id) },
     });
  } catch (error) {
     throw  "Player not found" 
  }
}

const getPlayersByGameId = async (gameId: number) => {
  return await prisma.player.findMany({
    where: {gameId : Number(gameId)}
  });
}

const createPlayer = async ( name: string, gameId: number, isHost: boolean) => {
  return await prisma.player.create({
    data: {
      name,
      gameId,
      isHost
    }
  });
}

export { getPlayerById, getPlayersByGameId, createPlayer}
