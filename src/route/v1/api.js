import express from "express";
import {
    authMiddleware,
    isAdminOrSuperAdminMiddleware,
    isSuperAdminMiddleware
} from "../../middleware/v1/auth-middleware.js";
import userController from "../../controller/v1/user-controller.js";
import carController from "../../controller/v1/car-controller.js";
import {upload} from "../../middleware/v1/upload-middleware.js";

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
userRouter.put("/api/v1/cars", upload.single("file"), carController.update);
userRouter.delete("/api/v1/cars/:carId", carController.remove);
userRouter.get("/api/v1/cars/:carId", carController.get);

export {
    userRouter,
}