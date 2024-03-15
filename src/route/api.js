import express from "express";
import {authMiddleware} from "../v1/middleware/auth-middleware.js";
import userController from "../v1/controller/user-controller.js";

const userRouter = express.Router();
userRouter.use(authMiddleware);

userRouter.get("/api/v1/users/current", userController.get);
userRouter.patch("/api/v1/users/current", userController.update);

export {
    userRouter,
}