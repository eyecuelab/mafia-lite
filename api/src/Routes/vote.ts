import votingControllers from "../Controllers/voting";
import express from "express";

const voterRouter = express.Router();

voterRouter.post('/vote', votingControllers.castVote);


export default voterRouter;