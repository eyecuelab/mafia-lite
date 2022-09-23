import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const traits: string[] = [
	"Hopeful",
	"Wistful",
	"Shady",
	"Boring",
	"Disciplined",
	"Quiet",
	"Loud",
	"Wild",
	"Energetic",
	"Literal",
	"Impolite",
	"Bossy",
	"Charismatic",
	"Sneaky",
	"Devious",
	"Clever",
	"Open",
	"Envious",
	"Orderly",
	"Mischievous",
	"Gullible",
	"Cowardly",
	"Superstitious",
	"Foolish",
	"Extravagant",
	"Logical",
	"Defensive",
	"Ignorant",
	"Naive",
	"Arrogant",
	"Skeptical",
	"Honest",
	"Trustworthy",
	"Thoughtless"
];

async function main() {
	await prisma.role.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			name: "Investigator",
			type: "investigator",
			nightTimePrompt: "Wait until daytime",
			roleDesc: "Uncover the cultists hidden among you"
		}
	});

	await prisma.role.upsert({
		where: { id: 2 },
		update: {},
		create: {
			id: 2,
			name: "Cultist",
			type: "cultist",
			nightTimePrompt: "Select a sacrifice",
			roleDesc: "Sacrifice players to your dark god without being discovered, lest you be sacrificed yourself"
		}
	});

	for (let i = 0; i < traits.length; i++) {
		await prisma.trait.upsert({
			where: { id: i },
			update: { name: traits[i] },
			create: { id: i, name: traits[i] }
		});
	}
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });