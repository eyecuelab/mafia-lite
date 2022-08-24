import playerControllers from "../Controllers/player";
import express from "express";

const router = express.Router();

router.get('/players/:gameId', playerControllers.getPlayers);
router.get('/player/:id', playerControllers.getSinglePlayer);

export default router; 