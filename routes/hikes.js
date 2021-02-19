const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const {
    index,
    renderNewHikeTrailForm,
    createHikeTrail,
    showHikeTrail,
    renderEditHikeTrailForm,
    editHikeTrailForm,
    deleteHikeTrail } = require("../controllers/hikes");

const { isLoggedIn, validateHike, isAuthor } = require("../middleware");

router.route("/")
    .get(catchAsync(index))
    .post(isLoggedIn, upload.array("image"), validateHike, catchAsync(createHikeTrail));
// .post(upload.array("image"), (req, res) => console.log(req.body, req.files));

router.get("/new", isLoggedIn, renderNewHikeTrailForm);

router.route("/:id")
    .get(catchAsync(showHikeTrail))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateHike, catchAsync(editHikeTrailForm))
    .delete(isLoggedIn, isAuthor, catchAsync(deleteHikeTrail));


router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(renderEditHikeTrailForm));


module.exports = router;