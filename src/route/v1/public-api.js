import express from "express";
import userController from "../../controller/v1/user-controller.js";

const publicRouter = express.Router();

publicRouter.post("/api/v1/users", userController.register);
publicRouter.post("/api/v1/users/login", userController.login);

export {
    publicRouter,
}