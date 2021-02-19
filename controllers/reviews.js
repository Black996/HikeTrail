const Hike = require("../models/hike");
const Review = require("../models/review");

module.exports = {
    addReview: async (req, res) => {
        const hike = await Hike.findById(req.params.id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        hike.reviews.push(review);
        await review.save();
        await hike.save();
        req.flash("success", "Successfully Made A New Review");
        res.redirect(`/hikes/${hike._id}`);
    },
    deleteReview: async (req, res) => {
        const { reviewId, id } = req.params;
        await Hike.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Successfully Deleted A Review");
        res.redirect(`/hikes/${id}`);
    }
}