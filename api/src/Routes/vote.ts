import votingControllers from "../Controllers/voting";
import express from "express";

const router = express.Router();

router.post('/vote', votingControllers.castVote);


export default router;