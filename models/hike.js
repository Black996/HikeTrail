const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
    {
        url: String,
        filename: String
    });

ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
})

const opts = { toJSON: { virtuals: true } };

const HikeSchema = new Schema({
    trail: String,
    distance: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    grade: String,
    area: String,
    isGuided: Boolean,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
}, opts);


HikeSchema.virtual('properties').get(function () {
    return {
        id: this._id,
        trail: this.trail,
        distance: this.distance,
        grade: this.grade
    }
});

HikeSchema.post("findOneAndDelete", async function (hike) {
    if (hike) {
        await Review.deleteMany({
            _id: {
                $in: hike.reviews
            }
        })
    }
})

module.exports = mongoose.model("Hike", HikeSchema);