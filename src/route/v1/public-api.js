const express = require('express');
const userController = require('../../controller/v1/user-controller');

const publicRouter = express.Router();

publicRouter.post('/api/v1/users', userController.register);
publicRouter.post('/api/v1/users/login', userController.login);

module.exports = publicRouter;
