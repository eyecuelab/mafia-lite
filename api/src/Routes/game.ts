import express from "express";
import gameControllers from "../Controllers/game";

const router = express.Router();

router.get('/game', gameControllers.getGames);
router.get("/game/:id", gameControllers.getSingleGame);

router.post('/game', gameControllers.createGame);


/* Test route for websockets using users data*/
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// router.get('/users', async (req, res) => {
//   const users = await prisma.user.findMany()
//   res.json(users)
// })
/* Remove before pushing to dev branch */

export default router;