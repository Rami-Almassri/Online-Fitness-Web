const mongoose = require("mongoose");

const trainerSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "please add a name"]
    },
    profilePicture: {
        type: String,
    },
    username: {
        type: String,
        required: [true, "please add a username"]
    },
    email: {
        type: String,
        required: [true, "please add an email"]
    },
    password: {
        type: String,
        required: [true, "please add a password"]
    },
    about: {
        type: String,
    }
}, {
    timestamps: true
});

module.exports = mongoose.models.Trainer || mongoose.model("Trainer", trainerSchema);