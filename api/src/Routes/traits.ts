import express from "express";
import { getTraits } from "../Models/traits";

const router = express.Router();

const getAllTraits = async (req: any, res: any) => {
	const traits = await getTraits();
	res.json(traits);
}

router.get('/traits', getAllTraits);

export default router; 