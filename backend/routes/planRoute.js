const express = require("express");
const router = express.Router();
const { createPlan, editPlan, deletePlan, ratePlan, getPlan, getAllPlansSortedByRating, searchForAPlan } = require("../controllers/planController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createPlan); // only trainer can access
router.put("/edit", protect, editPlan); // only trainer can access
router.put("/rate", protect, ratePlan); // only member can access
router.get("/allSorted", getAllPlansSortedByRating);
router.get("/:id", getPlan);
router.get("/search/:query", searchForAPlan);
router.delete("/delete/:id", protect, deletePlan); // only trainer can access

module.exports = router;