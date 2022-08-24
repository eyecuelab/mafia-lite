import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express';
import cors from 'cors';
import gameRouter from "./Routes/game";
import roundRouter from "./Routes/round";
import userRouter from "./Routes/user";
import playerRouter from "./Routes/player";
import gameSettingsRouter from "./Routes/gameSettings"


const prisma = new PrismaClient()
const app = express()

app.use(cors({ origin: '*'}));

app.use(express.json())


app.use(gameRouter, userRouter, roundRouter, playerRouter, gameSettingsRouter)



export default app;