import Joi from "joi";

const createCarValidation = Joi.object({
    name: Joi.string().max(255).required(),
    cost_per_day: Joi.number().required(),
    size: Joi.string().max(100).required(),
});

const updateCarValidation = Joi.object({
    id: Joi.number().positive().required(),
    name: Joi.string().max(255).required(),
    cost_per_day: Joi.number().required(),
    size: Joi.string().max(100).required(),
});

const getCarValidation = Joi.number().positive().required();

export {
    createCarValidation,
    updateCarValidation,
    getCarValidation,
}

