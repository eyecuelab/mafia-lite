import roundController from "../Controllers/round";
import express from "express";

const router = express.Router();

router.get('/rounds/:gameId', roundController.getRounds);
router.get("/round/:id", roundController.getSingleRound);

// router.post('/game', gameControllers.createGame);

export default router;