import express from "express";
import chatControllers from "../Controllers/chat";

const router = express.Router();

router.post('/chat/sendChat', chatControllers.sendChat);
router.post('/chat/verifyRole', chatControllers.verifyRole);
router.post('/chat/verifyDeath', chatControllers.verifyDeath);

export default router;