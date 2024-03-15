import express from "express";
import {authMiddleware} from "../v1/middleware/auth-middleware.js";
import userController from "../v1/controller/user-controller.js";
import {superAdminMiddleware} from "../v1/middleware/super-admin-middleware.js";

const userRouter = express.Router();
// userRouter.use(authMiddleware);

userRouter.get("/api/v1/users/current", authMiddleware, userController.get);
userRouter.patch("/api/v1/users/current", authMiddleware, userController.update);
userRouter.delete("/api/v1/users/logout", authMiddleware, userController.logout);
userRouter.post("/api/v1/users/admin", superAdminMiddleware, userController.createAdmin);

export {
    userRouter,
}