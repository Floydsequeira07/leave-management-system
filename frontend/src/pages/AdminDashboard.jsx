import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSignOutAlt,
} from "react-icons/fa";

function AdminDashboard() {
  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
  });

  const [leaves, setLeaves] = useState([]);

  // Confirmation popup state
  const [confirmation, setConfirmation] = useState({
    show: false,
    type: "",
    leaveId: null,
  });

  const navigate = useNavigate();

  // =========================
  // INITIAL LOAD + AUTO REFRESH
  // =========================

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || storedUser.role !== "admin") {
      navigate("/");
      return;
    }

    setUser(storedUser);

    // Fetch immediately
    fetchStats();
    fetchLeaves();

    // Automatically refresh every 5 seconds
    const interval = setInterval(() => {
      fetchStats();
      fetchLeaves();
    }, 5000);

    // Stop polling when leaving page
    return () => {
      clearInterval(interval);
    };
  }, []);

  // =========================
  // GET ADMIN STATS
  // =========================

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/leaves/admin/stats"
      );

      setStats(res.data);
    } catch (error) {
      console.error("Stats error:", error);
    }
  };

  // =========================
  // GET ALL LEAVES
  // =========================

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/leaves/admin/all"
      );

      setLeaves(res.data);
    } catch (error) {
      console.error("Leaves error:", error);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/");
  };

  // =========================
  // OPEN CONFIRMATION POPUP
  // =========================

  const openConfirmation = (type, leaveId) => {
    setConfirmation({
      show: true,
      type: type,
      leaveId: leaveId,
    });
  };

  // =========================
  // CLOSE CONFIRMATION POPUP
  // =========================

  const closeConfirmation = () => {
    setConfirmation({
      show: false,
      type: "",
      leaveId: null,
    });
  };

  // =========================
  // CONFIRM APPROVE / REJECT
  // =========================

  const confirmAction = async () => {
    const { type, leaveId } = confirmation;

    try {
      if (type === "approve") {
        await axios.put(
          `http://localhost:5000/api/leaves/admin/${leaveId}/approve`
        );
      } else {
        await axios.put(
          `http://localhost:5000/api/leaves/admin/${leaveId}/reject`
        );
      }

      // Close popup
      closeConfirmation();

      // Immediately refresh admin data
      await fetchStats();
      await fetchLeaves();

    } catch (error) {
      console.error("Action error:", error);

      alert(
        error.response?.data?.message ||
          `Failed to ${type} leave`
      );

      closeConfirmation();
    }
  };

  // =========================
  // CALCULATE LEAVE DAYS
  // =========================

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference =
      Math.floor(
        (end - start) / (1000 * 60 * 60 * 24)
      ) + 1;

    return difference;
  };

  // =========================
  // LOADING
  // =========================

  if (!user) {
    return <div>Loading...</div>;
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= NAVBAR ================= */}

      <nav className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center">

        <h1 className="text-xl font-bold">
          Leave Management System
        </h1>

        <div className="flex items-center gap-4">

          <span>
            Welcome{" "}
            <span className="font-semibold">
              {user.name}
            </span>
          </span>

          <button
            onClick={handleLogout}
            className="bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-800 transition flex items-center gap-2"
          >
            <FaSignOutAlt size={15} />
            Logout
          </button>

        </div>
      </nav>

      {/* ================= MAIN ================= */}

      <div className="p-6">

        {/* ================= HEADING ================= */}

        <div className="mb-6">

          <h2 className="text-2xl font-bold text-gray-800">
            Admin Dashboard
          </h2>

          <p className="text-gray-500">
            Manage employee leave requests and approvals.
          </p>

        </div>

        {/* ================= STATISTICS ================= */}

        <h3 className="text-lg font-semibold mb-4">
          Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

          {/* Total Employees */}

          <div className="bg-white p-5 rounded-xl shadow">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Total Employees
                </p>

                <h2 className="text-3xl font-bold text-purple-600 mt-2">
                  {stats.totalEmployees}
                </h2>

              </div>

              <FaUsers
                className="text-purple-500"
                size={22}
              />

            </div>

          </div>

          {/* Pending */}

          <div className="bg-white p-5 rounded-xl shadow">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Pending Leaves
                </p>

                <h2 className="text-3xl font-bold text-orange-500 mt-2">
                  {stats.pendingLeaves}
                </h2>

              </div>

              <FaClock
                className="text-orange-500"
                size={22}
              />

            </div>

          </div>

          {/* Approved */}

          <div className="bg-white p-5 rounded-xl shadow">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Approved Leaves
                </p>

                <h2 className="text-3xl font-bold text-green-600 mt-2">
                  {stats.approvedLeaves}
                </h2>

              </div>

              <FaCheckCircle
                className="text-green-500"
                size={22}
              />

            </div>

          </div>

          {/* Rejected */}

          <div className="bg-white p-5 rounded-xl shadow">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Rejected Leaves
                </p>

                <h2 className="text-3xl font-bold text-red-500 mt-2">
                  {stats.rejectedLeaves}
                </h2>

              </div>

              <FaTimesCircle
                className="text-red-500"
                size={22}
              />

            </div>

          </div>

        </div>

        {/* ================= LEAVE REQUESTS ================= */}

        <div className="bg-white rounded-xl shadow p-5">

          <div className="flex justify-between items-center mb-4">

            <h3 className="text-lg font-semibold">
              Leave Requests
            </h3>

          </div>

          {leaves.length === 0 ? (

            <p className="text-gray-500">
              No leave requests yet.
            </p>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>

                  <tr className="border-b text-left">

                    <th className="p-3">
                      Employee
                    </th>

                    <th className="p-3">
                      Leave Type
                    </th>

                    <th className="p-3">
                      Days
                    </th>

                    <th className="p-3">
                      Start Date
                    </th>

                    <th className="p-3">
                      End Date
                    </th>

                    <th className="p-3">
                      Reason
                    </th>

                    <th className="p-3">
                      Leave Balance
                    </th>

                    <th className="p-3">
                      Status
                    </th>

                    <th className="p-3">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {leaves.map((leave) => (

                    <tr
                      key={leave.id}
                      className="border-b"
                    >

                      {/* Employee */}

                      <td className="p-3 font-medium">
                        {leave.employee_name}
                      </td>

                      {/* Leave Type */}

                      <td className="p-3 capitalize">
                        {leave.leave_type}
                      </td>

                      {/* Days */}

                      <td className="p-3 font-medium">
                        {calculateDays(
                          leave.start_date,
                          leave.end_date
                        )}{" "}
                        days
                      </td>

                      {/* Start Date */}

                      <td className="p-3">
                        {leave.start_date}
                      </td>

                      {/* End Date */}

                      <td className="p-3">
                        {leave.end_date}
                      </td>

                      {/* Reason */}

                      <td className="p-3">
                        {leave.reason || "-"}
                      </td>

                      {/* Leave Balance */}

                      <td className="p-3">

                        <div className="text-xs space-y-1">

                          <p>
                            <span className="font-medium">
                              Casual:
                            </span>{" "}
                            {leave.casual_leave ?? 0} /{" "}
                            {leave.casual_total ?? 0}
                          </p>

                          <p>
                            <span className="font-medium">
                              Sick:
                            </span>{" "}
                            {leave.sick_leave ?? 0} /{" "}
                            {leave.sick_total ?? 0}
                          </p>

                          <p>
                            <span className="font-medium">
                              Earned:
                            </span>{" "}
                            {leave.earned_leave ?? 0} /{" "}
                            {leave.earned_total ?? 0}
                          </p>

                          <p className="text-red-500">
                            <span className="font-medium">
                              LOP:
                            </span>{" "}
                            {leave.unpaid_leave ?? 0}
                          </p>

                        </div>

                      </td>

                      {/* Status */}

                      <td className="p-3">

                        <div className="flex items-center gap-2 capitalize">

                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              leave.status === "approved"
                                ? "bg-green-500"
                                : leave.status === "rejected"
                                ? "bg-red-500"
                                : "bg-orange-400"
                            }`}
                          ></span>

                          {leave.status}

                        </div>

                      </td>

                      {/* Action */}

                      <td className="p-3">

                        {leave.status === "pending" ? (

                          <div className="flex gap-2">

                            <button
                              onClick={() =>
                                openConfirmation(
                                  "approve",
                                  leave.id
                                )
                              }
                              className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-green-600"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                openConfirmation(
                                  "reject",
                                  leave.id
                                )
                              }
                              className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-red-600"
                            >
                              Reject
                            </button>

                          </div>

                        ) : (

                          <span className="text-gray-400">
                            Completed
                          </span>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* ================= CONFIRMATION POPUP ================= */}

      {confirmation.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">

            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Action
            </h2>

            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to{" "}
              <span className="font-semibold">
                {confirmation.type === "approve"
                  ? "approve"
                  : "reject"}
              </span>{" "}
              this leave request?
            </p>

            <div className="flex justify-end gap-3">

              {/* Cancel */}

              <button
                onClick={closeConfirmation}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-100"
              >
                Cancel
              </button>

              {/* Confirm */}

              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-lg text-white text-sm ${
                  confirmation.type === "approve"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {confirmation.type === "approve"
                  ? "Approve"
                  : "Reject"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminDashboard;