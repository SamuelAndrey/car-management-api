import {validate} from "../../validation/v1/validation.js";
import {createCarValidation, getCarValidation, updateCarValidation} from "../../validation/v1/car-validation.js";
import {prismaClient} from "../../application/database.js";
import {ResponseError} from "../../error/response-error.js";
import path from "path";
import {uploadDirectory} from "../../middleware/v1/upload-middleware.js";
import fs from "fs";

const removeImageFromDirectory = (fileName) => {
    const filteredImageUrl = fileName.replace('/public/uploads/', '');
    const filePath = path.join(uploadDirectory, filteredImageUrl);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}


const create = async (request) => {
    const car = validate(createCarValidation, request.body);

    car.image = '/public/uploads/' + request.file.filename;
    car.cost_per_day = parseInt(car.cost_per_day);

    return prismaClient.car.create({
        data: car,
        select: {
            id: true,
            name: true,
            cost_per_day: true,
            size: true,
            image: true,
            updated_at: true,
        }
    });
};

const list = async () => {
    return prismaClient.car.findMany({
        select: {
            id: true,
            name: true,
            cost_per_day: true,
            size: true,
            image: true,
            updated_at: true,
        }
    });
};

const update = async (request) => {
    const car = validate(updateCarValidation, request.body);

    car.cost_per_day = parseInt(car.cost_per_day);

    const carInDatabase = await prismaClient.car.findFirst({
        where: {
            id: car.id,
        },
    });

    if (!carInDatabase) {
        throw new ResponseError(404, "car is not found");
    }

    const data = { ...car };

    if (request.file) {
        removeImageFromDirectory(carInDatabase.image);
        data.image = '/public/uploads/' + request.file.filename;
    }

    return prismaClient.car.update({
        where: {
            id: car.id,
        },
        data: data,
        select: {
            id: true,
            name: true,
            cost_per_day: true,
            size: true,
            image: true
        }
    });
};

const remove = async (carId) => {
    carId = validate(getCarValidation, carId);
    const carInDatabase = await prismaClient.car.findFirst({
        where: {
            id: carId,
        },
    });

    if (!carInDatabase) {
        throw new ResponseError(404, "car is not found");
    }

    removeImageFromDirectory(carInDatabase.image);

    return prismaClient.car.delete({
        where: {
            id: carId
        }
    });
}

const get = async (carId) => {
    carId = validate(getCarValidation, carId);
    const carInDatabase = await prismaClient.car.findFirst({
        where: {
            id: carId,
        },
    });

    if (!carInDatabase) {
        throw new ResponseError(404, "car is not found");
    }

    return prismaClient.car.findMany({
        where: {
          id: carId,
        },
        select: {
            id: true,
            name: true,
            cost_per_day: true,
            size: true,
            image: true,
            updated_at: true,
        }
    });

}


export default {
    create,
    list,
    update,
    remove,
    get,
}