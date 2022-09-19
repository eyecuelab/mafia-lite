import cors from 'cors';
import express from 'express';
import gameRouter from "./Routes/game";
import playerRouter from "./Routes/player";
import roundRouter from "./Routes/round";
import logicRouter from "./Routes/logic";
import voterRouter from './Routes/vote';
import roleRouter from './Routes/role';
import traitsRouter from './Routes/traits';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';
import { SessionOptions } from 'express-session';
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from '../swagger.json';

const session = require("express-session")
const app = express();
const environment = app.get('env');

app.use(cors({ origin: [
  'http://localhost:5173',
  'https://nameless-terror-client.fly.dev',
  'https://nameless-terror-api.fly.dev',
], credentials: true }));

app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument));

const secret = process.env.SESSION_SECRET || 'default-app-secret';

const sessionOptions: SessionOptions = {
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: environment === 'production' ? true : false,
    sameSite: environment === 'production' ? 'none' : 'lax',
  },
  store: new PrismaSessionStore(
    new PrismaClient(),
    {
      checkPeriod: 2 * 60 * 1000,  //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  )
}

app.use(session(sessionOptions));

if (environment === 'production') {
  app.set('trust proxy', 1) // trust first proxy
}

app.use(express.json());
app.use(gameRouter, roundRouter, playerRouter, logicRouter, voterRouter, roleRouter, traitsRouter);

export default app;