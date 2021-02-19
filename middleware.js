const { valHikeSchema, valReviewSchema } = require("./validationSchemas");
const ExpressError = require("./utils/ExpressError");
const Hike = require("./models/hike");
const Review = require("./models/review");


module.exports = {
    isLoggedIn: (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.session.returnTo = req.originalUrl;
            req.flash("error", "You must be signed in first!")
            return res.redirect("/login");
        }
        next();
    },
    validateHike: (req, res, next) => {
        const { error } = valHikeSchema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(",");
            throw new ExpressError(msg, 400)
        } else {
            next();
        }
    },

    isAuthor: async (req, res, next) => {
        const { id } = req.params
        const hike = await Hike.findById(id);
        if (!hike.author.equals(req.user._id)) {
            req.flash("error", "YOU DON'T HAVE THE PERMISSION TO DO THAT!")
            return res.redirect(`/hikes/${hike._id}`)
        }
        next();
    },
    isAuthorRev: async (req, res, next) => {
        const { id, reviewId } = req.params
        const review = await Review.findById(reviewId);
        if (!review.author.equals(req.user._id)) {
            req.flash("error", "YOU DON'T HAVE THE PERMISSION TO DO THAT!")
            return res.redirect(`/hikes/${id}`)
        }
        next();
    },
    validateReview: (req, res, next) => {
        const { error } = valReviewSchema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(",");
            throw new ExpressError(msg, 400)
        } else {
            next();
        }
    }
}