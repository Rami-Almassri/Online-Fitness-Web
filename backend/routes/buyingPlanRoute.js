const express = require("express");
const router = express.Router();
const { buyPlan } = require("../controllers/buyingPlanController");
const { protect } = require("../middleware/authMiddleware");

router.post("/createSession", protect, buyPlan); // create a Stripe session for the user to buy the plan

module.exports = router;