import express from "express";
import logicControllers from "../Controllers/logic";

const router = express.Router();

router.post("/start", logicControllers.startGame);


export default router;