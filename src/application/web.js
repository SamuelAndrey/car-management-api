import express from "express";
import {publicRouter} from "../route/v1/public-api.js";
import {userRouter} from "../route/v1/api.js";
import {errorMiddleware} from "../middleware/v1/error-middleware.js";
import {uploadDirectory} from "../middleware/v1/upload-middleware.js";

export const web = express();

web.use(express.json());

web.use(publicRouter);
web.use(userRouter);

web.use(errorMiddleware);

web.use('/public/uploads/', express.static(uploadDirectory));