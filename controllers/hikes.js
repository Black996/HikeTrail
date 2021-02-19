const Hike = require("../models/hike");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports = {

    index: async (req, res) => {
        const hikes = await Hike.find({});
        res.render("hikes/index", { hikes });
    },
    renderNewHikeTrailForm: (req, res) => {
        res.render("hikes/new");
    },
    createHikeTrail: async (req, res, next) => {
        // if (!req.body.hike) throw new ExpressError("Invalid Hike Trail Data", 400);
        const geoData = await geocoder.forwardGeocode({
            query: req.body.hike.area,
            limit: 1
        }).send()
        const hike = new Hike(req.body.hike);
        hike.geometry = geoData.body.features[0].geometry;
        hike.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
        hike.author = req.user._id;
        await hike.save();
        console.log(hike);
        req.flash("success", "Successfully made a new Hiking Trail");
        res.redirect(`/hikes/${hike._id}`);
    },
    showHikeTrail: async (req, res) => {
        const { id } = req.params;
        const hike = await Hike.findById(id).populate({
            path: "reviews", populate: { path: "author" }
        }).populate("author");
        if (!hike) {
            req.flash("error", "Cannot Find That Hiking Trail!");
            return res.redirect("/hikes");
        }
        res.render("hikes/show", { hike });
    },
    renderEditHikeTrailForm: async (req, res) => {
        const { id } = req.params;
        const hike = await Hike.findById(id);
        if (!hike) {
            req.flash("error", "Cannot Find That Hiking Trail!");
            res.redirect("/hikes");
        }
        res.render("hikes/edit", { hike });
    },
    editHikeTrailForm: async (req, res) => {
        const { id } = req.params;
        console.log(req.body);
        const hike = await Hike.findByIdAndUpdate(id, { ...req.body.hike }, { useFindAndModify: false });
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        hike.images.push(...imgs);
        await hike.save();
        if (req.body.deleteImages) {
            for (let filename of req.body.deleteImages) {
                await cloudinary.uploader.destroy(filename);
            }
            await hike.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
            console.log(hike);
        }
        req.flash("success", "Successfully Updated Hiking Trail");
        res.redirect(`/hikes/${hike._id}`);
    },
    deleteHikeTrail: async (req, res) => {
        const { id } = req.params;
        await Hike.findByIdAndDelete(id, { useFindAndModify: false });
        req.flash("success", "Successfully Deleted The Hiking Trail");
        res.redirect("/hikes");
    }
}