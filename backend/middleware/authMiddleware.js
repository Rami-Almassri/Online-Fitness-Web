const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Member = require("../models/memberModel");
const Trainer = require("../models/trainerModel");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // get token from the request headers
            token = req.headers.authorization.split(" ")[1];

            // check if the token is valid
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);

            // check if the member or trainer exists
            if(decoded.role == "member") {
                req.member = await Member.findById(decoded.id).select("-password");
            } else if(decoded.role == "trainer") {
                req.trainer = await Trainer.findById(decoded.id).select("-password");
            }

            // we can proceed with request
            next();
        } catch(error) {
            console.log(error);
            res.status(401);
            throw new Error("not authorized")
        }
    }

    if(!token) {
        res.status(401);
        throw new Error("no token, not authorized");
    }
});

module.exports = { protect };