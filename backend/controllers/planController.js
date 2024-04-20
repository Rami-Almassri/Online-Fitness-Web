const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Plan = require("../models/planModel");
const Trainer = require("../models/trainerModel");
const Member = require("../models/memberModel");

// @desc    Create a plan
// @route   POST api/plan/create
// @access  private
const createPlan = asyncHandler(async (req, res) => {
    const { id } = await Trainer.findById(req.trainer.id);
    const { title, about, price, index, content } = req.body;

    if(!title || !about || !price || !index || !content) {
        throw new Error("Please enter all fields");
    }
    
    // create the plan
    const plan = await Plan.create({
        trainer: id, title, about, price, index, content
    });

    if(plan) {
        res.status(201).json(plan);
    }
});

// @desc    Edit a plan
// @route   PUT api/plan/edit
// @access  private
const editPlan = asyncHandler(async (req, res) => {
    const { title, about, price, index, content, planID } = req.body;

    if(!title || !about || !price || !index || !content) {
        throw new Error("Please enter all fields");
    }
    
    // update the plan
    const plan = await Plan.findByIdAndUpdate(planID, {
        $set: {
            title, about, price, index, content
        },
    });

    if(plan) {
        res.status(201).json(plan);
    }
});

// @desc    Delete a plan
// @route   DELETE api/plan/delete/:id
// @access  private
const deletePlan = asyncHandler(async (req, res) => {
    const planID = new mongoose.Types.ObjectId(req.params.id);

    const removePlan = await Plan.findByIdAndDelete(planID);

    if(removePlan) {
        res.status(200).json(removePlan);
    }
});

// @desc    Rate a plan
// @route   PUT api/plan/rate
// @access  private
const ratePlan = asyncHandler(async (req, res) => {
    const { id } = await Member.findById(req.member.id);
    const { planId, newRating} = req.body;

    if(!planId || !newRating) {
        throw new Error("Please enter all fields");
    }
    
    // we append the new rating to it
    const addRating = await Plan.findByIdAndUpdate(planId, {
        $addToSet: {
            rating: {
                user: id,
                rating: newRating,
            }
        }
    });

    if(addRating) {
        res.status(201).json(addRating);
    }
});

// @desc    Search for a plan
// @route   GET api/plan/search/:query
// @access  private
const searchForAPlan = asyncHandler(async (req, res) => {
    // get all the plans that matches the query
    const searchResults = await Plan.find({"title": {'$regex' : req.params.query, '$options' : 'i'}});

    if(searchResults) {
        res.status(200).json(searchResults);
    }
});

// @desc    Plan page
// @route   GET api/plan/:id
// @access  private
const getPlan = asyncHandler(async (req, res) => {
    const planId = new mongoose.Types.ObjectId(req.params.id);

    // find the plan
    const plan = await Plan.aggregate([
        {
            $lookup: {
                from: "trainers",
                localField: "trainer",
                foreignField: "_id",
                as: "trainer",
            },
        },
        {
            $unwind:  "$trainer",
        },
        {
            $match: { "_id": planId, },
        },
    ]);

    // the plan exists
    if(plan) {
        res.status(200).json(plan[0]);
    }
});

// @desc    All plans sorted by rating
// @route   GET api/plan/allSorted
// @access  private
const getAllPlansSortedByRating = asyncHandler(async (req, res) => {
    // get all the plans sorted by the rating
    const allPlans = await Plan.aggregate([
        {
            $addFields: { ratings_count: {$size: { "$ifNull": [ "$rating", [] ] } } }
        },
        {
            $sort: {"ratings_count": -1}
        }
    ]);

    // the plan exists
    if(allPlans) {
        res.status(200).json(allPlans);
    }
});

module.exports = {
    createPlan,
    editPlan,
    deletePlan,
    ratePlan,
    getPlan,
    getAllPlansSortedByRating,
    searchForAPlan
}