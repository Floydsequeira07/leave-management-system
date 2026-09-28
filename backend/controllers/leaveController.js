const db = require("../config/db");

// ======================================================
// EMPLOYEE: Get leave balance
// ======================================================

const getLeaveBalance = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      `SELECT
        casual_total,
        casual_leave,
        sick_total,
        sick_leave,
        earned_total,
        earned_leave,
        unpaid_leave
       FROM leave_balances
       WHERE user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Leave balance not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ======================================================
// EMPLOYEE: Get leave history
// ======================================================

const getMyLeaves = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      `SELECT
        id,
        leave_type,
        DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(end_date, '%Y-%m-%d') AS end_date,
        reason,
        status,
        admin_comment,
        applied_at
       FROM leave_requests
       WHERE user_id = ?
       ORDER BY applied_at DESC`,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ======================================================
// EMPLOYEE: Apply for leave
// ======================================================

const applyLeave = async (req, res) => {
  try {
    const {
      user_id,
      leave_type,
      start_date,
      end_date,
      reason,
    } = req.body;

    // Validate fields
    if (
      !user_id ||
      !leave_type ||
      !start_date ||
      !end_date ||
      !reason
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Validate dates
    if (new Date(end_date) < new Date(start_date)) {
      return res.status(400).json({
        message: "End date cannot be before start date",
      });
    }

    // Check employee exists
    const [users] = await db.query(
      "SELECT id FROM users WHERE id = ? AND role = 'employee'",
      [user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    // Store leave request
    await db.query(
      `INSERT INTO leave_requests
      (user_id, leave_type, start_date, end_date, reason)
      VALUES (?, ?, ?, ?, ?)`,
      [
        user_id,
        leave_type,
        start_date,
        end_date,
        reason,
      ]
    );

    res.status(201).json({
      message: "Leave applied successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ======================================================
// ADMIN: Dashboard statistics
// ======================================================

const getAdminStats = async (req, res) => {
  try {
    const [[employeeCount]] = await db.query(
      `SELECT COUNT(*) AS totalEmployees
       FROM users
       WHERE role = 'employee'`
    );

    const [[pendingCount]] = await db.query(
      `SELECT COUNT(*) AS pendingLeaves
       FROM leave_requests
       WHERE status = 'pending'`
    );

    const [[approvedCount]] = await db.query(
      `SELECT COUNT(*) AS approvedLeaves
       FROM leave_requests
       WHERE status = 'approved'`
    );

    const [[rejectedCount]] = await db.query(
      `SELECT COUNT(*) AS rejectedLeaves
       FROM leave_requests
       WHERE status = 'rejected'`
    );

    res.json({
      totalEmployees: employeeCount.totalEmployees,
      pendingLeaves: pendingCount.pendingLeaves,
      approvedLeaves: approvedCount.approvedLeaves,
      rejectedLeaves: rejectedCount.rejectedLeaves,
    });
  } catch (error) {
    console.error("Admin stats error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ======================================================
// ADMIN: Get all leave requests
// ======================================================

const getAllLeaves = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        lr.id,
        lr.user_id,
        u.name AS employee_name,
        lr.leave_type,

        DATE_FORMAT(lr.start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(lr.end_date, '%Y-%m-%d') AS end_date,

        lr.reason,
        lr.status,
        lr.admin_comment,

        lb.casual_total,
        lb.casual_leave,

        lb.sick_total,
        lb.sick_leave,

        lb.earned_total,
        lb.earned_leave,

        lb.unpaid_leave

       FROM leave_requests lr

       JOIN users u
         ON lr.user_id = u.id

       LEFT JOIN leave_balances lb
         ON lr.user_id = lb.user_id

       ORDER BY lr.applied_at DESC`
    );

    res.json(rows);

  } catch (error) {
    console.error("Get all leaves error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
// ======================================================
// ADMIN: Approve leave
// ======================================================

const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;

    // Get leave request
    const [leaves] = await db.query(
      `SELECT
        id,
        user_id,
        leave_type,
        start_date,
        end_date,
        status
       FROM leave_requests
       WHERE id = ?`,
      [id]
    );

    if (leaves.length === 0) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    const leave = leaves[0];

    // Prevent approving already processed leave
    if (leave.status !== "pending") {
      return res.status(400).json({
        message: "Leave request has already been processed",
      });
    }

    // Calculate leave days
    const start = new Date(leave.start_date);
    const end = new Date(leave.end_date);

    const diffTime = end - start;

    const leaveDays =
      Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Get employee balance
    const [balances] = await db.query(
      `SELECT
        casual_leave,
        sick_leave,
        earned_leave,
        unpaid_leave
       FROM leave_balances
       WHERE user_id = ?`,
      [leave.user_id]
    );

    if (balances.length === 0) {
      return res.status(404).json({
        message: "Leave balance not found",
      });
    }

    const balance = balances[0];

    let availableLeave = 0;

    if (leave.leave_type === "casual") {
      availableLeave = balance.casual_leave;
    } else if (leave.leave_type === "sick") {
      availableLeave = balance.sick_leave;
    } else if (leave.leave_type === "earned") {
      availableLeave = balance.earned_leave;
    }

    // Paid leave used
    const paidDays = Math.min(
      leaveDays,
      availableLeave
    );

    // Remaining days become unpaid
    const unpaidDays = leaveDays - paidDays;


    // Update balance
    if (leave.leave_type === "casual") {
      await db.query(
        `UPDATE leave_balances
         SET
           casual_leave = casual_leave - ?,
           unpaid_leave = unpaid_leave + ?
         WHERE user_id = ?`,
        [
          paidDays,
          unpaidDays,
          leave.user_id,
        ]
      );
    }

    if (leave.leave_type === "sick") {
      await db.query(
        `UPDATE leave_balances
         SET
           sick_leave = sick_leave - ?,
           unpaid_leave = unpaid_leave + ?
         WHERE user_id = ?`,
        [
          paidDays,
          unpaidDays,
          leave.user_id,
        ]
      );
    }

    if (leave.leave_type === "earned") {
      await db.query(
        `UPDATE leave_balances
         SET
           earned_leave = earned_leave - ?,
           unpaid_leave = unpaid_leave + ?
         WHERE user_id = ?`,
        [
          paidDays,
          unpaidDays,
          leave.user_id,
        ]
      );
    }


    // Mark request approved
    await db.query(
      `UPDATE leave_requests
       SET status = 'approved'
       WHERE id = ?`,
      [id]
    );

    res.json({
      message: "Leave approved successfully",
      leaveDays,
      paidDays,
      unpaidDays,
    });

  } catch (error) {
    console.error("Approve leave error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ======================================================
// ADMIN: Reject leave
// ======================================================

const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `UPDATE leave_requests
       SET status = 'rejected'
       WHERE id = ? AND status = 'pending'`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Leave request not found or already processed",
      });
    }

    res.json({
      message: "Leave rejected successfully",
    });

  } catch (error) {
    console.error("Reject leave error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getLeaveBalance,
  getMyLeaves,
  applyLeave,
  getAdminStats,
  getAllLeaves,
  approveLeave,
  rejectLeave,
};