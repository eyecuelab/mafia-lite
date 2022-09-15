import { PrismaClient, Trait } from '@prisma/client';
const prisma = new PrismaClient();

const createTrait = async (name: string) => {
	return await prisma.trait.create({
		data: { name }
	});
}

const assignTrait = async (traitId: number, playerId: number) => {
	return await prisma.playerTrait.create({
		data: { traitId, playerId }
	});
}

const getPlayerTraits = async (playerId: number) => {
	const playerTraits = await prisma.playerTrait.findMany({
		where: { playerId }
	});

	let traitNames: string[] = [];
	for (let i = 0; i < playerTraits.length; i++) {
		const trait = await getTraitById(playerTraits[i].traitId);
		if (!trait) throw new Error("Unable to retrieve trait data");

		traitNames.push(trait.name);
	}
	
	return traitNames;
}

const getTraits = async () => {
	return await prisma.trait.findMany();
}

const getTraitById = async (id: number) => {
	return await prisma.trait.findUnique({
		where: { id }
	});
}

export { createTrait, assignTrait, getPlayerTraits, getTraits };