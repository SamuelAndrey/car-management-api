// import Joi from "joi";
const Joi = require("joi");

const registerUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    name: Joi.string().max(255).required(),
    email: Joi.string().max(200).email().required(),
});

const loginUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
});

const getUserValidation = Joi.string().max(100).required();

const updateUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).optional(),
    name: Joi.string().max(255).optional(),
    email: Joi.string().max(200).email().optional(),
});

module.exports = {
    registerUserValidation,
    loginUserValidation,
    getUserValidation,
    updateUserValidation
}

// export {
//     registerUserValidation,
//     loginUserValidation,
//     getUserValidation,
//     updateUserValidation
// }

