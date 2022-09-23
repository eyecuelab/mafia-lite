import express from "express";
import logicControllers from "../Controllers/logic";

const router = express.Router();

router.post("/start", logicControllers.startGame);
// router.post("/startNight", logicControllers.startNight);
// router.post("/startDay", logicControllers.startDay);
router.post("/image", logicControllers.submitGhostImage);

router.get("/image", logicControllers.getGhostTarget);

export default router;