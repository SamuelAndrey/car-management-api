const express = require('express');
const publicRouter = require('../route/v1/public-api');
const userRouter = require('../route/v1/api');
const { errorMiddleware } = require('../middleware/v1/error-middleware');
const { uploadDirectory } = require('../middleware/v1/upload-middleware');
const carController = require('../controller/v1/car-controller');

const web = express();
module.exports = web;

web.use(express.json());

web.use(publicRouter);
web.use(userRouter);

web.get('/api/v1/cars', carController.list);

web.use(errorMiddleware);

web.use('/public/uploads/', express.static(uploadDirectory));
