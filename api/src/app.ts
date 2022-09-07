import cors from 'cors';
import express from 'express';
import gameRouter from "./Routes/game";
import playerRouter from "./Routes/player";
import roundRouter from "./Routes/round";
import logicRouter from "./Routes/logic";

const session = require("express-session")

const app = express();

app.use(cors({ origin: [
  'http://localhost:5173',
  'https://nameless-terror-client.fly.dev'
], credentials: true }));

app.use(
  session({
    secret: "123sDareweq123a1q",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

app.use(express.json());
app.use(gameRouter, roundRouter, playerRouter, logicRouter);

export default app;