import cors from 'cors';
import express from 'express';
import gameRouter from "./Routes/game";
import playerRouter from "./Routes/player";
import roundRouter from "./Routes/round";
import logicRouter from "./Routes/logic";
import voterRouter from './Routes/vote';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';

const session = require("express-session")

const app = express();

const environment = app.get('env')

app.use(cors({ origin: [
  'http://localhost:5173',
  'https://nameless-terror-client.fly.dev',
], credentials: true }));


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: environment === 'development' ? false : true,
    },
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,  // 2 minutes
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

app.use(express.json());
app.use(gameRouter, roundRouter, playerRouter, logicRouter, voterRouter);

export default app;