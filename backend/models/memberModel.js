const mongoose = require("mongoose");

const goalSchema = mongoose.Schema({
    currentWeight: {
        type: String,
    },
    weightGoal: {
        type: String,
    },
    goal: {
        type: String,
    },
}, {
    _id: false
});

const boughtPlansSchema = mongoose.Schema({
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Plan",
    }
}, {
    _id: false
});

const memberSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "please add a name"]
    },
    username: {
        type: String,
        required: [true, "please add a username"]
    },
    email: {
        type: String,
        required: [true, "please add an email"]
    },
    profilePicture: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "please add a password"]
    },
    goal: goalSchema,
    boughtPlans: [boughtPlansSchema]
}, {
    timestamps: true
});

module.exports = mongoose.models.Member || mongoose.model("Member", memberSchema);