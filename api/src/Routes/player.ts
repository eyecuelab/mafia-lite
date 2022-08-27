import playerControllers from "../Controllers/player";
import express from "express";

const router = express.Router();

router.get('/players/:gameId', playerControllers.getPlayers);
router.get('/player/:id', playerControllers.getSinglePlayer);

router.put('/player', playerControllers.updatePlayer);

export default router; 