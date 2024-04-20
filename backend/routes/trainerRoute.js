const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware").single("trainerProfilePicture");
const { protect } = require("../middleware/authMiddleware");
const { signUpTrainer, loginTrainer, getTrainer, getTopTrainer, getTrainerById, editAbout } = require("../controllers/trainerController");
const { trainerUploadProfilePicture } = require("../controllers/uploadController");
const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.post("/", signUpTrainer);
router.post("/login", loginTrainer);
router.post("/uploadProfilePicture", upload, protect, trainerUploadProfilePicture); // upload the photo, then add to the trainer's document
router.put("/editAbout", protect, editAbout);
router.get("/me",  protect, getTrainer);
router.get("/top", getTopTrainer);
router.get("/:id", getTrainerById);

module.exports = router;