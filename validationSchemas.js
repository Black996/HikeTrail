const Joi = require("joi");
const sanitizeHtml = require("sanitize-html");

module.exports = {
    valHikeSchema: Joi.object({
        hike: Joi.object({
            trail: Joi.string().required(),
            distance: Joi.number().required(),
            // image: Joi.string().required(),
            grade: Joi.string().required().valid("easy", "hard", "medium").insensitive(),
            area: Joi.string().required(),
            isGuided: Joi.boolean().required()
        }).required(),
        deleteImages: Joi.array()
    }),
    valReviewSchema: Joi.object({
        review: Joi.object({
            rating: Joi.number().required().min(1).max(5),
            body: Joi.string().required()
        }).required()
    })


}