import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
import cors from 'cors';

const prisma = new PrismaClient()
const app = express()

app.use(cors({ origin: '*'}));

app.use(express.json())

app.post("/game", async (req, res) => {
	const { hostId } = req.body;
	if (!hostId) {
		return res.status(500).json({ error: "Host required to start game"});
	}

	const host = await prisma.user.findUnique({
		where: { id: Number(hostId) },
	});
	if (!host) {
		return res.status(500).json({ error: "Host not found"});
	}

	const game = await prisma.game.create({
		data: {
			hostId
		}
	});

	res.json(game);
})

app.get("/game", async (req, res) => {
	const games = await prisma.game.findMany();
	res.json(games);
})

app.get("/game/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const game = await prisma.game.findUniqueOrThrow({
			where: { id: Number(id) },
		});

		res.json(game);
	}  catch (error) {
		return res.status(404).json({ error: "Game not found" });
	}
})

const server = app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
)