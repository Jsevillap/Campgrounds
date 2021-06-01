const Joi = require("joi");// require Joi to handle validation

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(1),
        description: Joi.string().required(),
        image: Joi.string().required()
    }).required()
});
