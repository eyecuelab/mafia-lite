import { PrismaClient } from '@prisma/client'
import express from 'express';
import cors from 'cors';
import gameRouter from "./Routes/game";
import roundRouter from "./Routes/round";
import userRouter from "./Routes/user";
import playerRouter from "./Routes/player";
import roleRouter from "./Routes/role";


const prisma = new PrismaClient();
const session = require('express-session');

// require('dotenv').config();
// would need to install npm dotenv

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use(cors({ origin: '*'}));
app.use(express.json());


app.use(gameRouter, userRouter, roundRouter, playerRouter, roleRouter);


export default app;