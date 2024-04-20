const { createPlan, editPlan, ratePlan } = require("../controllers/planController");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv").config();
const connectDB = require("../config/db");

describe("Plan validation", () => {
    connectDB();
    // test for the condition when the user doesn't enter all the fields of a plan
    it("Create: Should enter all fields", asyncHandler(async () => {
        const req = {
            body: {
                title: "Some plan",
                about: "About this plan",
                price: "50"
            },
            trainer: {
                id: "65ac86e8513482261e406900"
            }
        };

        await expect(createPlan(req, res={})).rejects.toThrowError("Please enter all fields");
    }));
    // test for the condition when the user doesn't enter all the fields of a plan
    it("Edit: Should enter all fields", asyncHandler(async () => {
        const req = {
            body: {},
            trainer: {
                id: "65ac86e8513482261e406900"
            }
        };

        await expect(editPlan(req, res={})).rejects.toThrowError("Please enter all fields");
    }));
    // test for the condition when the user doesn't enter a rating
    it("Rating: Should enter rating", asyncHandler(async () => {
        const req = {
            body: {},
            member: {
                id: "65ac864f513482261e4068fb"
            }
        };

        await expect(ratePlan(req, res={})).rejects.toThrowError("Please enter all fields");
    }));

});