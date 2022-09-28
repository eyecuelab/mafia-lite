import { Player, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createNewRound = async (roundNumber: number, gameId: number) => {
	console.log("Creating round ", roundNumber);
	return await prisma.round.create({
		data: {
			gameId,
			roundNumber
		}
	});
}

const getRoundByGameID = async (gameId: number) => {
  return await prisma.round.findMany({
    where: { gameId: Number(gameId)}
  });
}

const getRoundById = async (id: number) => {
  try {
    return await prisma.round.findUniqueOrThrow ({
      where: { id: Number(id)},
      include: {
        died: true
      }
      
    })
  } catch (error) {
    throw "Round not found";
  }
}

const endRound = async (roundId: number,) => {
  return await prisma.round.update({
    where: { id: roundId },
    data: { endedAt : new Date(), }
  })
}

const getCurrentRoundByGameId = async (gameId: number) => {
	const rounds = await prisma.round.findMany({
		where: { gameId },
		orderBy: { roundNumber: "desc" }
	});

	return rounds[0];
}

const updateToNightPhase = async (currentRoundId: number) => {
  return await prisma.round.update({
    where: { id: currentRoundId },
    data: { currentPhase : "night" }
  });
}

const addGhostImage = async (gameId: number, imgIndex: number) => {
	const currRound = await getCurrentRoundByGameId(gameId);
	return await prisma.round.update({
		where: { id: currRound.id },
		data: { 
			ghostImages: {
				push: imgIndex
			}
		}
	})
}

const getGhostImages = async (gameId: number) => {
	const rounds = await prisma.round.findMany({
		where: { 
			gameId,
			currentPhase: "night"
		},
		orderBy: { roundNumber: "desc" }
	});

	return rounds[0]?.ghostImages;
};

export { getRoundByGameID, getRoundById, endRound, createNewRound, getCurrentRoundByGameId, updateToNightPhase, addGhostImage, getGhostImages }