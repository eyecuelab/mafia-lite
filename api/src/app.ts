import { Prisma, PrismaClient } from '@prisma/client';
import cors from 'cors';
import express from 'express';
import routes from "./Routes/game";

const prisma = new PrismaClient()
const app = express()

app.use(cors({ origin: '*' }));

app.use(express.json())

app.use(routes)

//app.get(singleGameRoute, )

export default app;