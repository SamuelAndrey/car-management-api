const express = require("express");
const publicRouter = require("../route/v1/public-api.js");
const userRouter = require("../route/v1/api.js");
const { errorMiddleware } = require("../middleware/v1/error-middleware.js");
const { uploadDirectory } = require("../middleware/v1/upload-middleware.js");
const carController = require("../controller/v1/car-controller");


const web = express();
module.exports = web;

web.use(express.json());

web.use(publicRouter);
web.use(userRouter);

web.get('/routes', (req, res) => {
    res.send(web._router.stack
        .filter(r => r.route)
        .map(r => r.route.path))
})

web.get("/api/v1/cars", carController.list);

web.use(errorMiddleware);

web.use('/public/uploads/', express.static(uploadDirectory));

