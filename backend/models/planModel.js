const mongoose = require("mongoose");
const Trainer = require("../models/trainerModel");
const Member = require("../models/memberModel");

const indexModel = mongoose.Schema({
    index: {
        type: Number,
        required: true,
    },
    indexTitle: {
        type: String,
        required: true,
    }
}, {
    _id: false
});

const contentModel = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
}, {
    _id: false
});

const ratingModel = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Member",
    },
    rating: {
        type: Number,
        required: true,
    }
}, {
    _id: false
});

const planModel = mongoose.Schema({
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Trainer",
    },
    banner: {
        type: String,
    },
    title: {
        type: String,
        required: [true, "please add a title"]
    },
    about: {
        type: String,
        required: [true, "please add an about"]
    },
    price: {
        type: Number,
        required: [true, "please add a price"]
    },
    index: [indexModel],
    content: [contentModel],
    rating: [ratingModel],
}, {
    timestamps: true
});

module.exports = mongoose.models.Plan || mongoose.model("Plan", planModel);