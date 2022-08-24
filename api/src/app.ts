import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express';
import cors from 'cors';
import gameRouter from "./Routes/game";
import roundRouter from "./Routes/round";
import userRouter from "./Routes/user";
import playerRouter from "./Routes/player";
import roleRouter from "./Routes/role";


const prisma = new PrismaClient();
const app = express();
const session = require('express-session');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { }
}))

app.use(cors({ origin: '*'}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(gameRouter, userRouter, roundRouter, playerRouter, roleRouter);

export default app;