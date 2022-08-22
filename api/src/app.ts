import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express';
import cors from 'cors';
import routes from "./Routes/game";
import roundRoutes from "./Routes/round";

const prisma = new PrismaClient()
const app = express()

app.use(cors({ origin: '*'}));

app.use(express.json())

app.use(routes)
app.use(roundRoutes);

//app.get(singleGameRoute, )

export default app;