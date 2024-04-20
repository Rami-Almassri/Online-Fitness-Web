const { signUpMember, loginMember, editGoal } = require("../controllers/memberController");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv").config();
const connectDB = require("../config/db");

describe("Member validation", () => {
    connectDB();
    // test for the condition when the user doesn't enter all his fields
    it("Sign-up: Should enter all fields", asyncHandler(async () => {
        const req = {
            body: {
                username: "rami.almassri",
                name: "Rami Almassri",
                password: "pass",
            }
        };

        await expect(signUpMember(req, res={})).rejects.toThrowError("Please enter all fields");
    }));
    // test for the condition when the user entered an email that already exists
    it("Sign-up: A member already exists", asyncHandler(async () => {
        const req = {
            body: {
                username: "rami.almassri",
                name: "Rami Almassri",
                password: "Rami1998@",
                email: "aaa.1200200@hotmail.com"
            }
        };

        await expect(signUpMember(req, res={})).rejects.toThrowError("Member already exists");
    }), 30000);
    // test for the condition when the user entered a wrong email or password
    it("Login: Member not found", asyncHandler(async () => {
        const req = {
            body: {
                password: "Rami1998@@",
                email: "aaa.12002000@hotmail.com"
            }
        };

        await expect(loginMember(req, res={})).rejects.toThrowError("Invalid user data");
    }), 30000);
    // test for the condition when the user doesn't enter a field to update
    it("Update Goal: No field to update", asyncHandler(async () => {
        const req = {
            body: {}
        };

        await expect(editGoal(req, res={})).rejects.toThrowError("No field to update");
    }));
});