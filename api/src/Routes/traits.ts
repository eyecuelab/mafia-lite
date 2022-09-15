import express from "express";
import { getTraits } from "../Models/traits";

/***********************/
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
/***********************/

const router = express.Router();

const getAllTraits = async (req: any, res: any) => {
	const traits = await getTraits();
	res.json(traits);
}

const addTraits = async (req: any, res: any) => {
	const { traits }: { traits: string[] } = req.body;
	for (let i = 0; i < traits.length; i++) {
		await prisma.trait.upsert({
			where: { id: i },
			update: {},
			create: { id: i, name: traits[i] }
		});
	}
	res.json()
}

router.get('/traits', getAllTraits);
router.post('/traits', addTraits);

export default router; 