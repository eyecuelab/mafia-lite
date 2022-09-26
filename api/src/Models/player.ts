import { Player, PrismaClient } from '@prisma/client';
import { getRoleById } from './role';


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
      isReady : false,
			isDisconnected: false
    }
  });
}

const setPlayerSocketId = async (playerId: number, socketId: string) => {
	return await prisma.player.update({
    where: { id: playerId },
    data: {
      socketId: socketId
    }
  });
}
const getPlayerBySocketId = async (sockedId: string) => {
	return await prisma.player.findFirst({
			where: {socketId : sockedId}
	})
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

const updatePlayerIsReady = async (id: number, readyStatus: boolean) => {
	return await prisma.player.update({
		where: { id },
		data: { isReady: readyStatus }
	});
}
const updatePlayerIsHost = async (newHostId: number, oldHostId: number) => {
	await prisma.player.update({
		where: { id: oldHostId },
		data: { isHost: false }
	});
	return await prisma.player.update({
		where: { id: newHostId },
		data: { isHost: true }
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

const getAlivePlayersByGameId = async (gameId: number) => {
	return await prisma.player.findMany({
		where: {
			gameId: gameId,
			OR: [
				{ status: "alive" }
			]
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

const getDeadPlayersByGameId = async (gameId: number) => {
	return await prisma.player.findMany({
		where: {
			gameId: gameId,
			OR: [
				{ status: "murdered" },
				{ status: "terminated" }
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

const changeConnectionStatus = async(playerId: number, currentConnectionStatus: boolean) => {
	return await prisma.player.update({
		where: { id: playerId },
		data: { isDisconnected: !currentConnectionStatus }
	});
}

export { getPlayerById, getPlayersByGameId, createPlayer, updatePlayerById, updatePlayerStatus, getJailedPlayer, getLivingPlayersByGameId, getDeadPlayersByGameId, getPlayersInGameByTeam, updatePlayerIsReady, getAlivePlayersByGameId, setPlayerSocketId, getPlayerBySocketId, updatePlayerIsHost, changeConnectionStatus };


