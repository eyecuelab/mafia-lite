import { Player, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const randomlyGenerateAvatar = () => {
  let randomImageNumber = Math.floor(Math.random() * (193 - 181) + 181);
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

const setUniqueAvatarPath = async (gameId: number) => {
  const maxNumOfPlayers = 12  //placeholder
  const getPlayersInGame = await getPlayersByGameId(gameId)
  let uniqueAvatarPath = randomlyGenerateAvatar();

  const avatarAlreadyAssigned = (path: string) => {
    return getPlayersInGame.some((player: Player) => player.avatar === path)
  }

  while (avatarAlreadyAssigned(uniqueAvatarPath)) {
    uniqueAvatarPath = randomlyGenerateAvatar();

    if (!avatarAlreadyAssigned) {
      return uniqueAvatarPath;
    } else if (avatarAlreadyAssigned(uniqueAvatarPath) && maxNumOfPlayers === getPlayersInGame.length) {
      console.log(`no unique photos remaining, total players: ${getPlayersInGame.length}`)
      return uniqueAvatarPath = ''
    }
  }
  return uniqueAvatarPath
}

const createPlayer = async (gameId: number, isHost: boolean, name: string) => {
  const getUniqueAvatarPath = await setUniqueAvatarPath(gameId);
  return await prisma.player.create({
    data: {
      gameId,
      isHost,
      name,
      avatar: getUniqueAvatarPath,
    }
  });
}

const updatePlayerById = async (id: number, roleId: number) => {
  await prisma.player.update({
    where: { id: id },
    data: {
      roleId: roleId
    }
  })
}

export { getPlayerById, getPlayersByGameId, createPlayer, updatePlayerById };

