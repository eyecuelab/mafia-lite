import { Prisma, PrismaClient } from '@prisma/client';
import cors from 'cors';
import express from 'express';
import gameRouter from "./Routes/game";
import playerRouter from "./Routes/player";
import roundRoutes from "./Routes/round";
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use(gameRouter, roundRoutes, playerRouter);

export default app;