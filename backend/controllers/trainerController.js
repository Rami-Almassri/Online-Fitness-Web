const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Trainer = require("../models/trainerModel");
const Plan = require("../models/planModel");

// @desc    Sign up trainer
// @route   POST api/trainer/
// @access  private
const signUpTrainer = asyncHandler(async (req, res) => {
    const {name, username, email, password} = req.body;

    // check if any input is empty
    if(!name || !username || !email || !password) {
        throw new Error("Please enter all fields");
    }

    // check if trainer already exists
    const trainerExists = await Trainer.findOne({email});
    if(trainerExists) {
        throw new Error("Trainer already exists");
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create member's account
    const trainer = await Trainer.create({
        name,
        username,
        email,
        password: hashedPassword,
    });

    // when the member's account is done created
    if(trainer) {
        console.log(trainer);
        res.status(201).json({
            _id: trainer.id,
            name: trainer.name,
            username: trainer.username,
            email: trainer.email,
            token: generateToken(trainer.id),
        })
    }
});

// @desc    Login trainer
// @route   POST api/trainer/login
// @access  private
const loginTrainer = asyncHandler( async(req, res) => {
    const {email, password} = req.body;
    
    if(!email || !password) {
        throw new Error("Enter all fields");
    }

    // if trainer exists
    const trainer = await Trainer.findOne({email});

    // if the trainer exists and the password he entered is correct
    if(trainer && (await bcrypt.compare(password, trainer.password))) {
        res.json({
            _id: trainer.id,
            name: trainer.name,
            username: trainer.username,
            email: trainer.email,
            token: generateToken(trainer.id),
        });
    } else {
        throw new Error("Invalid user data");
    }
});

// @desc    Trainer profile
// @route   GET api/trainer/me
// @access  private
const getTrainer = asyncHandler(async (req, res) => {
    const trainerId = new mongoose.Types.ObjectId(req.trainer.id);

    const trainer = await Trainer.aggregate([
    {
        $lookup: {
            from: "plans",
            localField: "_id",
            foreignField: "trainer",
            as: "plans",
        },
    },
    {
        $match: { "_id": trainerId, },
    }]);

    res.status(200).json(trainer[0]);
});

// @desc    Trainer profile by Id
// @route   GET api/trainer/:id
// @access  private
const getTrainerById = asyncHandler(async (req, res) => {
    const trainerId = new mongoose.Types.ObjectId(req.params.id);

    const trainer = await Trainer.aggregate([
    {
        $lookup: {
            from: "plans",
            localField: "_id",
            foreignField: "trainer",
            as: "plans",
        },
    },
    {
        $match: { "_id": trainerId, },
    }]);

    res.status(200).json(trainer[0]);
});

// @desc    Returns trainers with the most plans
// @route   GET api/trainer/top
// @access  private
const getTopTrainer = asyncHandler(async (req, res) => {
    const topTrainers = await Trainer.aggregate([
        {
            $lookup: {
                from: "plans",
                localField: "_id",
                foreignField: "trainer",
                as: "result",
            },
        },
        { $unwind: "$result", },
        {
            $group: {
                _id: "$_id",
                name: {
                    $first: "$name",
                },
                profilePicture: {
                    $first: "$profilePicture"
                },
                count: {
                    $sum: 1,
                },
            },
        },
        { $sort: { count: -1, }, },
    ]);

    res.status(200).json(topTrainers)
});

// @desc    Edit about
// @route   PUT api/trainer/editAbout
// @access  private
const editAbout = asyncHandler(async (req, res) => {
    // find the trainer and edit the about
    const { about } = req.body;
    if(!about) {
        throw new Error("No field to update");
    }
    const updateTrainerAbout = await Trainer.findByIdAndUpdate(req.trainer.id, {
        $set: {
            about: about
        }
    });

    // the update was successful
    if(updateTrainerAbout) {
        res.status(201).json(updateTrainerAbout);
    }
});

// generate a token
const generateToken = (id) => {
    return jwt.sign({id, role: "trainer"}, process.env.JWT_SECRET, {expiresIn: '30d'});
};

module.exports = {
    signUpTrainer,
    loginTrainer,
    getTrainer,
    getTopTrainer,
    getTrainerById,
    editAbout
}