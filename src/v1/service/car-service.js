import {validate} from "../validation/validation.js";
import {createCarValidation} from "../validation/car-validation.js";
import {prismaClient} from "../../application/database.js";

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


export default {
    create,
    list
}