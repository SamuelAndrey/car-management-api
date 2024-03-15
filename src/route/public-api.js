import express from "express";
import userController from "../v1/controller/user-controller.js";

const publicRouter = express.Router();

publicRouter.post("/api/v1/users", userController.register);
publicRouter.post("/api/v1/users/login", userController.login);

export {
    publicRouter,
}