import gameSettingsController from "../Controllers/gameSettings";
import express from "express";

const router = express.Router();

router.get('/gameSettings/:gameId', gameSettingsController.getGameSettings);
router.put("/gameSettings/:id", gameSettingsController.updateGameSettings);
// router.post("/gameSettings/:gameId", gameSettingsController.createGameSettings);


export default router;