import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express';
import cors from 'cors';
import routes from "./Routes/game";
import userRouter from "./Routes/user";

const prisma = new PrismaClient()
const app = express()

app.use(cors({ origin: '*'}));

app.use(express.json())

app.use(routes, userRouter)

//app.get(singleGameRoute, )

export default app;