import { Player, PrismaClient } from '@prisma/client';
import { getGameById } from './game';
import { getRoleById } from './role';
import { getRoundById } from './round';

// import all 12 images from assets/images/portraits
// create an array of all images
// create a function that randomly selects an image from the array or an index

const prisma = new PrismaClient();

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

const randomlyGenerateAvatar = () => {
  let randomImageNumber = Math.floor(Math.random() * (193 - 181) + 181);
  const avatarBasePath = `./portraits/image_${randomImageNumber}.png`;
  return avatarBasePath;
}

const setUniqueAvatarPath = async (gameId: number) => {
  const maxNumOfPlayers = 12  //placeholder
  const getPlayersInGame = await getPlayersByGameId(gameId) //get players in game
  let uniqueAvatarPath = randomlyGenerateAvatar(); //generate string of file path with randomized num

  const avatarAlreadyAssigned = (path: string) => { //checks players if some have the path in their avatar property
    return getPlayersInGame.some((player: Player) => player.avatar === path)
  }

  while (avatarAlreadyAssigned(uniqueAvatarPath)) {
    uniqueAvatarPath = randomlyGenerateAvatar();  //runs function above and if that avatar is already assigned keep running it endlessly...

    if (!avatarAlreadyAssigned) { //finally if it is a unique avatar path return
      return uniqueAvatarPath;
    } else if (avatarAlreadyAssigned(uniqueAvatarPath) && maxNumOfPlayers === getPlayersInGame.length) {
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
  return await prisma.player.update({
    where: { id: id },
    data: {
      roleId: roleId
    }
  });
}

const updatePlayerStatus = async (id: number, newStatus: string) => {
	return await prisma.player.update({
		where: { id },
		data: { status: newStatus }
	});
}

const getJailedPlayer = async (gameId: number) => {
	return await prisma.player.findFirst({
		where: {
			gameId,
			status: "jailed"
		}
	});
}

const getLivingPlayersByGameId = async (gameId: number) => {
	return await prisma.player.findMany({
		where: {
			gameId: gameId,
			OR: [
				{ status: "alive" },
				{ status: "jailed" }
			]
		}
	});
}

const getPlayersInGameByTeam = async (gameId: number) => {
	const players = await getPlayersByGameId(gameId);

	const playersByTeam: { investigators: Player[], cultists: Player[] } = { investigators: [], cultists: [] };
	for (let i = 0; i < players.length; i++) {
		const role = await getRoleById(players[i].roleId);
		if (role?.type === "cultist") {
			playersByTeam.cultists.push(players[i]);
		} else {
			playersByTeam.investigators.push(players[i]);
		}
	}

	return playersByTeam;
}

export { getPlayerById, getPlayersByGameId, createPlayer, updatePlayerById, updatePlayerStatus, getJailedPlayer, getLivingPlayersByGameId, getPlayersInGameByTeam };

