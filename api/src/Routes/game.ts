import express from "express";
import gameControllers from "../Controllers/game";

const router = express.Router();

router.get('/games', gameControllers.getGames);
router.get("/game", gameControllers.getSingleGame);

router.post('/game', gameControllers.createGame);
router.post('/game/leave', gameControllers.playerLeaveGame);
router.post('/game/end', gameControllers.endGameLeave);

export default router;