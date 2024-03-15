import express from "express";
import {publicRouter} from "../route/public-api.js";
import {userRouter} from "../route/api.js";
import {errorMiddleware} from "../v1/middleware/error-middleware.js";

export const web = express();
web.use(express.json());

web.use(publicRouter);
web.use(userRouter);

web.use(errorMiddleware);