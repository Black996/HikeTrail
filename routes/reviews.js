const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isAuthorRev } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const { addReview, deleteReview } = require("../controllers/reviews");


router.post("/", validateReview, isLoggedIn, catchAsync(addReview));

router.delete("/:reviewId", isLoggedIn, isAuthorRev, catchAsync(deleteReview));

module.exports = router;