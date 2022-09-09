import playerControllers from "../Controllers/player";
import express from "express";

const router = express.Router();

router.get('/players/:gameId', playerControllers.getPlayers);
router.get('/player/game', playerControllers.getPlayerGame);
router.get('/player', playerControllers.getSinglePlayer);

router.post('/player', playerControllers.createPlayer);

router.put('/player', playerControllers.updatePlayer);

export default router; 