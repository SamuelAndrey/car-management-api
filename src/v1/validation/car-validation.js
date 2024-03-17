import Joi from "joi";

const createCarValidation = Joi.object({
    name: Joi.string().max(255).required(),
    cost_per_day: Joi.number().required(),
    size: Joi.string().max(100).required(),
});

export {
    createCarValidation,
}

