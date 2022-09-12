import cors from 'cors';
import express from 'express';
import gameRouter from "./Routes/game";
import playerRouter from "./Routes/player";
import roundRouter from "./Routes/round";
import logicRouter from "./Routes/logic";
import voterRouter from './Routes/vote';


const session = require("express-session")

const app = express();

const environment = app.get('env')

app.use(cors({ origin: [
  'http://localhost:5173',
  'https://nameless-terror-client.fly.dev'
], credentials: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: environment === 'development' ? false : true,
      // secure: process.env.SESSION_SECURE === "false" ? false : true,
    },
  })
);

app.use(express.json());
app.use(gameRouter, roundRouter, playerRouter, logicRouter, voterRouter);

export default app;