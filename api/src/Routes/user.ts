import userControllers from "../Controllers/user";
import express from "express";

const userRouter = express.Router();

userRouter.get('/user', userControllers.getUsers);
userRouter.get('/user/:id', userControllers.getSingleUser);

userRouter.post('/user', userControllers.createUser);
userRouter.put('/user/:id', userControllers.updateUser);

userRouter.delete('/user/:id', userControllers.deleteUser);

export default userRouter;