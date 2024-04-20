const asyncHandler = require("express-async-handler");
const Member = require("../models/memberModel");
const Trainer = require("../models/trainerModel");

// @desc    Upload trainer's profile picture
// @route   POST api/trainer/uploadProfilePicture
// @access  private
const trainerUploadProfilePicture = asyncHandler(async (req, res) => {
    await Trainer.findByIdAndUpdate(req.trainer.id, {
        $set: {
            profilePicture: req.file.filename
        }
    });

    res.status(201).json({"Success": "true"});
});

// @desc    Upload trainer's profile picture
// @route   POST api/trainer/uploadProfilePicture
// @access  private
const memberUploadProfilePicture = asyncHandler(async (req, res) => {
    await Member.findByIdAndUpdate(req.member.id, {
        $set: {
            profilePicture: req.file.filename
        }
    });

    res.status(201).json({"Success": "true"});
});

module.exports = {
    trainerUploadProfilePicture,
    memberUploadProfilePicture
}