import express from "express";
import {
    authMiddleware,
    isAdminOrSuperAdminMiddleware,
    isSuperAdminMiddleware
} from "../v1/middleware/auth-middleware.js";
import userController from "../v1/controller/user-controller.js";
import carController from "../v1/controller/car-controller.js";
import {upload} from "../v1/middleware/upload-middleware.js";

const userRouter = express.Router();
// userRouter.use(authMiddleware);

// user router
userRouter.get("/api/v1/users/current", authMiddleware, userController.get);
userRouter.patch("/api/v1/users/current", authMiddleware, userController.update);
userRouter.delete("/api/v1/users/logout", authMiddleware, userController.logout);
userRouter.post("/api/v1/users/admin", isSuperAdminMiddleware, userController.createAdmin);

// car router
userRouter.post("/api/v1/cars", upload.single("file"), carController.create);
userRouter.get("/api/v1/cars", carController.list);

export {
    userRouter,
}