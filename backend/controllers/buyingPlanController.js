const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const Member = require("../models/memberModel");
const Plan = require("../models/planModel");

// @desc    Buy a plan
// @route   POST api/buyPlan/createSession
// @access  private
const buyPlan = asyncHandler(async (req, res) => {
    const plan = await Plan.findById(req.body.id);

    if(!plan) {
        throw new Error("Plan not found");
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [{
                price_data: {
                    currency: "gbp",
                    product_data: {
                        name: plan.title
                    },
                    unit_amount: plan.price * 100,
                },
                quantity: 1
            }],
            success_url: "http://127.0.0.1:5500/public/successfulPayment.html?boughtPlan="+req.body.id,
            cancel_url: "http://127.0.0.1:5500/public/plan.html?plan="+req.body.id
        });
        res.json({url: session.url})
    } catch (e) {
        res.status(500).json({"error": e.message})
    }
});

module.exports = {
    buyPlan
}