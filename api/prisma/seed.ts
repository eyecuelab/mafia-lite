import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	await prisma.role.upsert({
		where: {id: 1},
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
		where: {id: 2},
		update: {},
		create: {
			id: 2,
			name: "Cultist",
			type: "cultist",
			nightTimePrompt: "Select a sacrafice",
			roleDesc: "Sacrafice players to your dark god without being discovered, lest you be sacraficed yourself"
		}
	});
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })