import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const traits: string[] = [
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"11",
	"12",
	"13",
	"14",
	"15",
	"16",
	"17",
	"18",
	"19",
	"20",
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
			nightTimePrompt: "Select a sacrafice",
			roleDesc: "Sacrfice players to your dark god without being discovered, lest you be sacraficed yourself"
		}
	});

	for (let i = 0; i < traits.length; i++) {
		await prisma.trait.upsert({
			where: { id: i },
			update: {},
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