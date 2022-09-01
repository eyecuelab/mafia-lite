import cors from 'cors';
import express from 'express';
import gameRouter from "./Routes/game";
import playerRouter from "./Routes/player";
import roundRouter from "./Routes/round";
import logicRouter from "./Routes/logic";

const session = require("express-session")

const app = express();

app.use(cors({ origin: '*' }));

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