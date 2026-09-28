const express = require("express");
const router = express.Router();

const {
  getLeaveBalance,
  getMyLeaves,
  applyLeave,
  getAdminStats,
  getAllLeaves,
  approveLeave,
  rejectLeave,
} = require("../controllers/leaveController");

// Employee
router.get("/balance/:userId", getLeaveBalance);
router.get("/my-leaves/:userId", getMyLeaves);
router.post("/", applyLeave);

// Admin
router.get("/admin/stats", getAdminStats);
router.get("/admin/all", getAllLeaves);
router.put("/admin/:id/approve", approveLeave);
router.put("/admin/:id/reject", rejectLeave);

module.exports = router;