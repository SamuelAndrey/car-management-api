// import carService from "../../service/v1/car-service.js";
// import fs from "fs";
// import path from "path";
// import {uploadDirectory} from "../../middleware/v1/upload-middleware.js";
// import {logger} from "../../application/logging.js";

const carService = require("../../service/v1/car-service.js");
const fs = require("fs");
const path = require("path");
const { uploadDirectory } = require("../../middleware/v1/upload-middleware.js");
const { logger } = require("../../application/logging.js");


const create = async (req, res, next) => {
    try {
        const result = await carService.create(req);
        result.image = req.protocol + '://' + req.get('host') + result.image;
        res.status(201).json({
            data: result
        });
    } catch (e) {
        if (req.file) {
            const filePath = path.join(uploadDirectory, req.file.filename);
            fs.unlinkSync(filePath);
        }
        next(e);
    }
};

const update = async (req, res, next) => {
    try {
        const result = await carService.update(req);
        result.image = req.protocol + '://' + req.get('host') + result.image;
        res.status(201).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
};

const list = async (req, res, next) => {
    try {
        const cars = await carService.list();
        const formattedCars = cars.map(car => {
            return {
                id: car.id,
                name: car.name,
                cost_per_day: car.cost_per_day,
                size: car.size,
                image: req.protocol + '://' + req.get('host') + car.image,
                updated_at: car.updated_at
            }
        });
        res.status(200).json({
            data: formattedCars
        });
    } catch (e) {
        next(e);
    }
};

const get = async (req, res, next) => {
    try {
        const car = await carService.get(req.params.carId);
        const formattedCars = car.map(car => {
            return {
                id: car.id,
                name: car.name,
                cost_per_day: car.cost_per_day,
                size: car.size,
                image: req.protocol + '://' + req.get('host') + car.image,
                updated_at: car.updated_at
            }
        });
        res.status(200).json({
            data: formattedCars
        });
    } catch (e) {
        next(e);
    }
}

const remove = async (req, res, next) => {
    try {
        await carService.remove(req.params.carId);
        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}


// export default {
//     create,
//     list,
//     update,
//     remove,
//     get,
// }

module.exports = {
    create,
    list,
    update,
    remove,
    get
}