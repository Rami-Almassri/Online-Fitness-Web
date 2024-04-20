const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Member = require("../models/memberModel");

// @desc    Sign up member
// @route   POST api/member/
// @access  private
const signUpMember = asyncHandler(async (req, res) => {
    const {name, username, email, password} = req.body;

    // check if any input is empty
    if(!name || !username || !email || !password) {
        throw new Error("Please enter all fields");
    }

    // check if member already exists
    const memberExists = await Member.findOne({email});
    if(memberExists) {
        throw new Error("Member already exists");
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create member's account
    const member = await Member.create({
        name,
        username,
        email,
        password: hashedPassword,
    });

    // when the member's account is done created
    if(member) {
        console.log(member);
        res.status(201).json({
            _id: member.id,
            name: member.name,
            username: member.username,
            email: member.email,
            token: generateToken(member.id),
        })
    }
});

// @desc    Member login
// @route   POST api/member/login
// @access  private
const loginMember = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    
    // if any input id missing
    if(!email || !password) {
        throw new Error("Please enter all fields");
    }

    // search for the member
    const member = await Member.findOne({email});

    // if the member exists and the password he entered is correct
    if(member && (await bcrypt.compare(password, member.password))) {
        res.json({
            _id: member.id,
            name: member.name,
            username: member.username,
            email: member.email,
            token: generateToken(member.id),
        });
    } else {
        throw new Error("Invalid user data");
    }
});

// @desc    Add plan to member's bought plans
// @route   POST api/member/addBoughtPlan
// @access  private
const addBoughtPlan = asyncHandler(async (req, res) => {
    // find the member and add the plan
    const addNewBoughtPlan = await Member.findByIdAndUpdate(req.member.id, {
        $addToSet: {
            boughtPlans: {
                planId: req.body.planId
            }
        }
    });

    // the update was successful
    if(addNewBoughtPlan) {
        res.status(201).json(addNewBoughtPlan);
    }
});

// @desc    profile
// @route   GET api/member/me
// @access  private
const getMember = asyncHandler(async (req, res) => {
    // find the member info
    const member = await Member.findById(req.member.id).select("-password");
    
    // return the member info
    res.status(200).json({
        member
    });
});

// @desc    Edit goal
// @route   PUT api/member/editGoal
// @access  private
const editGoal = asyncHandler(async (req, res) => {
    // find the member and update the goal
    const { currentWeight, weightGoal, goal } = req.body;

    if(!currentWeight & !weightGoal & !goal) {
        throw new Error("No field to update");
    }

    const updateMemberGoal = await Member.findByIdAndUpdate(req.member.id, {
        $set: {
            goal: {
                currentWeight: currentWeight ?? req.member.goal.currentWeight,
                weightGoal: weightGoal ?? req.member.goal.weightGoal,
                goal: goal ?? req.member.goal.goal,
            }
        }
    });

    // the update was successful
    if(updateMemberGoal) {
        res.status(201).json({
            msg: `Goal for ${req.member.username} has been updated`,
        });
    }
});

// generate a token
const generateToken = (id) => {
    return jwt.sign({id, role: "member"}, process.env.JWT_SECRET, {expiresIn: '30d'});
};

module.exports = {
    signUpMember,
    loginMember,
    getMember,
    editGoal,
    addBoughtPlan
}