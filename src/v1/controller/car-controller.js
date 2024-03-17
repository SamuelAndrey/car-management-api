import carService from "../service/car-service.js";
import fs from "fs";
import path from "path";
import {uploadDirectory} from "../middleware/upload-middleware.js";

const create = async (req, res, next) => {
    try {
        const result = await carService.create(req);
        res.status(201).json({
            data: result
        })
    } catch (e) {
        if (req.file) {
            const filePath = path.join(uploadDirectory, req.file.filename);
            fs.unlinkSync(filePath);
        }
        next(e);
    }
};

export default {
    create,
}