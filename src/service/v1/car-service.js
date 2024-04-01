const { validate } = require("../../validation/v1/validation.js");
const { createCarValidation, getCarValidation, updateCarValidation } = require("../../validation/v1/car-validation.js");
const { prismaClient } = require("../../application/database.js");
const { ResponseError } = require("../../error/response-error.js");
const path = require("path");
const { uploadDirectory } = require("../../middleware/v1/upload-middleware.js");
const fs = require("fs");

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

module.exports = {
    create,
    list,
    update,
    remove,
    get,
};
