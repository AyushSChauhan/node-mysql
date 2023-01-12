const Joi = require("@hapi/joi");

function testimonialValidate(req) {
    const schema = Joi.object({

        name: Joi.string().required().empty().messages({
            "string.base": `Testimonial name should be a type of 'text'`,
            "string.empty": `Testimonial name cannot be an empty field`,
            "any.required": `Testimonial name is a required field`,
        }),
        designation: Joi.string().required().empty().messages({
            "string.base": `Designation should be a type of 'text'`,
            "string.empty": `Designation cannot be an empty field`,
            "any.required": `Designation is a required field`,
        }),
        description: Joi.string().required().empty().messages({
            "string.base": `Testimonial Description should be a type of 'text'`,
            "string.empty": `Testimonial Description cannot be an empty field`,
            "any.required": `Testimonial Description is a required field`,
        }),
    })
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    return schema.validate(req, options);
}


module.exports = {
    testimonialValidate
}