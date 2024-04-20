const { signUpTrainer, loginTrainer,  editAbout } = require("../controllers/trainerController");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv").config();
const connectDB = require("../config/db");

describe("Trainer validation", () => {
    connectDB();
    // test for the condition when the user doesn't enter all his fields
    it("Sign-up: Should enter all fields", asyncHandler(async () => {
        const req = {
            body: {
                username: "rami-almassri",
                name: "Rami Almassri",
                password: "pass",
            }
        };

        await expect(signUpTrainer(req, res={})).rejects.toThrowError("Please enter all fields");
    }));
    // test for the condition when the user entered an email that already exists
    it("Sign-up: A member already exists", asyncHandler(async () => {
        const req = {
            body: {
                username: "rami-almassri",
                name: "Rami Almassri",
                password: "Rami1998@",
                email: "rami.almassri@students.plymouth.ac.uk"
            }
        };

        await expect(signUpTrainer(req, res={})).rejects.toThrowError("Trainer already exists");
    }), 30000);
    // test for the condition when the user entered a wrong email or password
    it("Login: Member not found", asyncHandler(async () => {
        const req = {
            body: {
                password: "Rami1998@@",
                email: "rami.almassri@students.plymouth.ac.uk@gmail.comm"
            }
        };

        await expect(loginTrainer(req, res={})).rejects.toThrowError("Invalid user data");
    }), 30000);
    // test for the condition when the user doesn't enter a field to update
    it("Update About: No field to update", asyncHandler(async () => {
        const req = {
            body: {}
        };

        await expect(editAbout(req, res={})).rejects.toThrowError("No field to update");
    }));
});