import votingControllers from "../Controllers/voting";
import express from "express";

const voterRouter = express.Router();

voterRouter.post('/vote', votingControllers.castVote);
voterRouter.post('/tallyVote', votingControllers.tallyVotes);


export default voterRouter;