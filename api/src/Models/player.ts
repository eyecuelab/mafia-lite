import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const randomlyGenerateAvatar = () => {
	let randomImageNumber = Math.floor(Math.random() * (192 - 181) + 181);
	const avatarBasePath = `./src/assets/The Nameless Terror Images/Portraits/image\ ${randomImageNumber}.png`;
	return avatarBasePath;
}

const getPlayerById = async (id: number) => {
  try {
    return await prisma.player.findUniqueOrThrow({
      where: { id: Number(id) },
    });
  } catch (error) {
    throw "Player not found"
  }
}

const getPlayersByGameId = async (gameId: number) => {
  return await prisma.player.findMany({
    where: { gameId: Number(gameId) }
  });
}

const createPlayer = async (gameId: number, isHost: boolean) => {

  return await prisma.player.create({
    data: {
      gameId,
      isHost,
      avatar: randomlyGenerateAvatar()
    }
  });
}

const updatePlayerById = async (id: number, name: string) => {
	return await prisma.player.update({
		where: {id: id},
		data: {name: name}
	})
}

export { getPlayerById, getPlayersByGameId, createPlayer, updatePlayerById }