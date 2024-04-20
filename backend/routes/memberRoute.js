const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware").single("memberProfilePicture");
const { signUpMember, loginMember, getMember, editGoal, addBoughtPlan } = require("../controllers/memberController");
const { memberUploadProfilePicture } = require("../controllers/uploadController");
const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.post("/", signUpMember);
router.post("/login", loginMember);
router.post("/addBoughtPlan", protect, addBoughtPlan);
router.post("/uploadProfilePicture", upload, protect, memberUploadProfilePicture); // upload the photo, then add to the member's document
router.get("/me", protect, getMember);
router.put("/editGoal", protect, editGoal);

module.exports = router;