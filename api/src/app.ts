import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express';
import cors from 'cors';
import gameRouter from "./Routes/game";
import roundRoutes from "./Routes/round";
import userRouter from "./Routes/user";
import playerRouter from "./Routes/player";
const app = express()

app.use(cors({ origin: '*'}));
app.use(express.json());

app.use(gameRouter, userRouter, roundRoutes, playerRouter);

export default app;