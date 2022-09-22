import { PrismaClient, Trait } from '@prisma/client';
import { getRandomLivingCultist } from './logic';
import { getCurrentRoundByGameId } from './round';
const prisma = new PrismaClient();

const createGhostTarget = async (gameId: number, ghostId: number) => {
	const target = await getRandomLivingCultist(gameId);
	const currRound = await getCurrentRoundByGameId(gameId);
	return await prisma.ghostTarget.create({
		data: {
			ghostId,
			targetId: target.id,
			roundId: currRound.id
		}
	})
};

const findGhostTarget = async (ghostId: number) => {
	const targets = await prisma.ghostTarget.findMany({
		where: { ghostId },
		orderBy: { round: { roundNumber: "desc" } }
	});

	return targets[0];
};

export { createGhostTarget, findGhostTarget };