import { PrismaClient, Player } from '@prisma/client';
import RoomCode from '../GenerateRoomCode';
import Utility from '../Logic/Utility';
import { getPlayersByGameId, updatePlayerIsHost } from './player';
const prisma = new PrismaClient();

const getGames = async () => {
  return await prisma.game.findMany();
}

const getGameById = async (id: number) => {
  try {
    return await prisma.game.findUniqueOrThrow({
      where: { id: Number(id) },
    });
  } catch (error) {
    if (error instanceof Error)
    throw (error.message)
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

const createNewGame = async (name: string, size: number) => {
  try {
    return await prisma.game.create({
    data: {
			gameCode : RoomCode.generate(),
			name: name,
			size: size
    }
  });  
  }
  catch (error) {
    if (error instanceof Error)
    throw (error.message)
  }
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
  catch (error) {
    if (error instanceof Error)
    throw (error.message)
  }
}

const deletePlayerFromGame = async(playerId: number) => {
    try {
      return await prisma.player.delete({
        where: { id: playerId } ,
      });
    }
    catch (e) {
      if (e instanceof Error) {
      throw (e.message);
    } else {
      throw (e);
    }
  }
}

const reassignHost = async(gameId: number, oldHostId: number) => {
    const players = await getPlayersByGameId(gameId);
    const eligiblePlayers = players.filter((player : Player) => {
      return !player.isDisconnected && player.id !== oldHostId
    })
    const shuffledPlayers = Utility.shuffleArray(eligiblePlayers);
	  const newHost = await updatePlayerIsHost(shuffledPlayers[0].id, oldHostId);
    return newHost;
}


export { getGames, getGameById, getAllGameDetails, createNewGame, getGameByGameCode, deletePlayerFromGame, reassignHost};