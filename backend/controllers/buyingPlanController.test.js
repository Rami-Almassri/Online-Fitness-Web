const { buyPlan } = require("../controllers/buyingPlanController");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv").config();
const connectDB = require("../config/db");

describe("Buying plan validation", () => {
    connectDB();
     // test for the condition where a user is trying to buy a plan that doesn't exist
    it("Buying plan: Throw error if the plan doesn't exist", asyncHandler(async () => {
        const req = {
            body: {
                _id: "e324r544w2r6322r",
            }
        };

        await expect(buyPlan(req, res={})).rejects.toThrowError("Plan not found");
    }), 10000);
});