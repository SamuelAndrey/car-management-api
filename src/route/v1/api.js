const express = require('express');
const {
  authMiddleware,
  isAdminOrSuperAdminMiddleware,
  isSuperAdminMiddleware,
} = require('../../middleware/v1/auth-middleware');
const userController = require('../../controller/v1/user-controller');
const carController = require('../../controller/v1/car-controller');
const { upload } = require('../../middleware/v1/upload-middleware');

const userRouter = express.Router();

// user router
userRouter.get('/api/v1/users/current', authMiddleware, userController.get);
userRouter.patch('/api/v1/users/current', authMiddleware, userController.update);
userRouter.delete('/api/v1/users/logout', authMiddleware, userController.logout);
userRouter.post('/api/v1/users/admin', isSuperAdminMiddleware, userController.createAdmin);

// car router
userRouter.post('/api/v1/cars', isAdminOrSuperAdminMiddleware, upload.single('file'), carController.create);
userRouter.get('/api/v1/cars', carController.list);
userRouter.put('/api/v1/cars', isAdminOrSuperAdminMiddleware, upload.single('file'), carController.update);
userRouter.delete('/api/v1/cars/:carId', isAdminOrSuperAdminMiddleware, carController.remove);
userRouter.get('/api/v1/cars/:carId', carController.get);

module.exports = userRouter;
