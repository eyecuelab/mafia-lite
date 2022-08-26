import express from 'express';
import cors from 'cors';
import gameRouter from "./Routes/game";
import roundRouter from "./Routes/round";
import playerRouter from "./Routes/player";

const session = require("express-session")

const app = express();

app.use(cors({ origin: '*'}));

app.use(
  session({
    secret: "123sDareweq123a1q",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

app.use(express.json());
app.use(gameRouter, roundRouter, playerRouter);


export default app;