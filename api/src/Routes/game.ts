import express from "express";
import gameControllers from "../Controllers/game";

const router = express.Router();

router.get('/game', gameControllers.getGames);
router.get("/game/:id", gameControllers.getSingleGame);

router.post('/game', gameControllers.createGame);
router.post('/game/join', gameControllers.joinGame);


export default router;