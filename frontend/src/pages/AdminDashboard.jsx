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
        `${import.meta.env.VITE_API_URL}/api/leaves/admin/stats`
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
        `${import.meta.env.VITE_API_URL}/api/leaves/admin/all`
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
          `${import.meta.env.VITE_API_URL}/api/leaves/admin/${leaveId}/approve`
        );
      } else {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/leaves/admin/${leaveId}/reject`
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Loading...
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= NAVBAR ================= */}

      <nav
        className="
          bg-purple-600
          text-white
          px-4
          sm:px-6
          py-4
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
          "
        >

          {/* Title */}

          <h1
            className="
              text-xl
              font-bold
              leading-tight
              text-center
              md:text-left
              whitespace-nowrap
            "
          >
            Leave Management System
          </h1>


          {/* Right Side */}

          <div
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              justify-center
              gap-3
              sm:gap-4
              w-full
              md:w-auto
            "
          >

            {/* Welcome */}

            <span
              className="
                text-sm
                sm:text-base
                whitespace-nowrap
              "
            >
              Welcome{" "}
              <span className="font-semibold">
                {user.name}
              </span>
            </span>


            {/* Logout */}

            <button
              onClick={handleLogout}
              className="
                bg-purple-700
                px-4
                py-2
                rounded-lg
                text-sm
                font-medium
                hover:bg-purple-800
                transition
                flex
                items-center
                justify-center
                gap-2
                whitespace-nowrap
              "
            >
              <FaSignOutAlt size={15} />
              Logout
            </button>

          </div>

        </div>
      </nav>


      {/* ================= MAIN ================= */}

      <div className="p-4 sm:p-6 max-w-7xl mx-auto">

        {/* ================= HEADING ================= */}

        <div className="mb-5 sm:mb-6">

          <h2
            className="
              text-xl
              sm:text-2xl
              font-bold
              text-gray-800
            "
          >
            Admin Dashboard
          </h2>

          <p
            className="
              text-gray-500
              text-sm
              sm:text-base
              mt-1
            "
          >
            Manage employee leave requests and approvals.
          </p>

        </div>


        {/* ================= STATISTICS ================= */}

        <h3 className="text-lg font-semibold mb-4">
          Overview
        </h3>


        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-4
            gap-4
            sm:gap-5
            mb-6
            sm:mb-8
          "
        >

          {/* ================= TOTAL EMPLOYEES ================= */}

          <div className="bg-white p-5 rounded-xl shadow">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Total Employees
                </p>

                <h2
                  className="
                    text-3xl
                    font-bold
                    text-purple-600
                    mt-2
                  "
                >
                  {stats.totalEmployees}
                </h2>

              </div>

              <FaUsers
                className="text-purple-500"
                size={22}
              />

            </div>

          </div>


          {/* ================= PENDING ================= */}

          <div className="bg-white p-5 rounded-xl shadow">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Pending Leaves
                </p>

                <h2
                  className="
                    text-3xl
                    font-bold
                    text-orange-500
                    mt-2
                  "
                >
                  {stats.pendingLeaves}
                </h2>

              </div>

              <FaClock
                className="text-orange-500"
                size={22}
              />

            </div>

          </div>


          {/* ================= APPROVED ================= */}

          <div className="bg-white p-5 rounded-xl shadow">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Approved Leaves
                </p>

                <h2
                  className="
                    text-3xl
                    font-bold
                    text-green-600
                    mt-2
                  "
                >
                  {stats.approvedLeaves}
                </h2>

              </div>

              <FaCheckCircle
                className="text-green-500"
                size={22}
              />

            </div>

          </div>


          {/* ================= REJECTED ================= */}

          <div className="bg-white p-5 rounded-xl shadow">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Rejected Leaves
                </p>

                <h2
                  className="
                    text-3xl
                    font-bold
                    text-red-500
                    mt-2
                  "
                >
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

        <div
          className="
            bg-white
            rounded-xl
            shadow
            p-4
            sm:p-5
          "
        >

          <div className="flex justify-between items-center mb-4">

            <h3 className="text-lg font-semibold">
              Leave Requests
            </h3>

          </div>


          {leaves.length === 0 ? (

            <p className="text-gray-500 text-sm sm:text-base">
              No leave requests yet.
            </p>

          ) : (

            /*
              Only the table scrolls horizontally.
              The complete dashboard does not overflow.
            */

            <div
              className="
                w-full
                overflow-x-auto
                rounded-lg
              "
            >

              <table
                className="
                  w-full
                  min-w-[1100px]
                  text-sm
                "
              >

                <thead>

                  <tr className="border-b text-left">

                    <th className="p-3 whitespace-nowrap">
                      Employee
                    </th>

                    <th className="p-3 whitespace-nowrap">
                      Leave Type
                    </th>

                    <th className="p-3 whitespace-nowrap">
                      Days
                    </th>

                    <th className="p-3 whitespace-nowrap">
                      Start Date
                    </th>

                    <th className="p-3 whitespace-nowrap">
                      End Date
                    </th>

                    <th className="p-3 whitespace-nowrap">
                      Reason
                    </th>

                    <th className="p-3 whitespace-nowrap">
                      Leave Balance
                    </th>

                    <th className="p-3 whitespace-nowrap">
                      Status
                    </th>

                    <th className="p-3 whitespace-nowrap">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {leaves.map((leave) => (

                    <tr
                      key={leave.id}
                      className="border-b hover:bg-gray-50 transition"
                    >

                      {/* Employee */}

                      <td className="p-3 font-medium whitespace-nowrap">
                        {leave.employee_name}
                      </td>


                      {/* Leave Type */}

                      <td className="p-3 capitalize whitespace-nowrap">
                        {leave.leave_type}
                      </td>


                      {/* Days */}

                      <td className="p-3 font-medium whitespace-nowrap">
                        {calculateDays(
                          leave.start_date,
                          leave.end_date
                        )}{" "}
                        days
                      </td>


                      {/* Start Date */}

                      <td className="p-3 whitespace-nowrap">
                        {leave.start_date}
                      </td>


                      {/* End Date */}

                      <td className="p-3 whitespace-nowrap">
                        {leave.end_date}
                      </td>


                      {/* Reason */}

                      <td
                        className="
                          p-3
                          max-w-[220px]
                        "
                      >
                        <span
                          className="block truncate"
                          title={leave.reason || "-"}
                        >
                          {leave.reason || "-"}
                        </span>
                      </td>


                      {/* Leave Balance */}

                      <td className="p-3">

                        <div className="text-xs space-y-1 min-w-[130px]">

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

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            capitalize
                            whitespace-nowrap
                          "
                        >

                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              leave.status === "approved"
                                ? "bg-green-500"
                                : leave.status === "rejected"
                                ? "bg-red-500"
                                : "bg-orange-400"
                            }`}
                          >
                          </span>

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
                              className="
                                bg-green-500
                                text-white
                                px-3
                                py-1.5
                                rounded-lg
                                text-xs
                                hover:bg-green-600
                                transition
                                whitespace-nowrap
                              "
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
                              className="
                                bg-red-500
                                text-white
                                px-3
                                py-1.5
                                rounded-lg
                                text-xs
                                hover:bg-red-600
                                transition
                                whitespace-nowrap
                              "
                            >
                              Reject
                            </button>

                          </div>

                        ) : (

                          <span className="text-gray-400 whitespace-nowrap">
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

        <div
          className="
            fixed
            inset-0
            bg-black/40
            flex
            items-center
            justify-center
            z-50
            p-4
          "
        >

          <div
            className="
              bg-white
              rounded-xl
              shadow-xl
              p-5
              sm:p-6
              w-full
              max-w-sm
              mx-auto
            "
          >

            <h2
              className="
                text-lg
                font-semibold
                text-gray-800
                mb-2
              "
            >
              Confirm Action
            </h2>


            <p
              className="
                text-gray-600
                text-sm
                mb-6
                leading-6
              "
            >
              Are you sure you want to{" "}
              <span className="font-semibold">
                {confirmation.type === "approve"
                  ? "approve"
                  : "reject"}
              </span>{" "}
              this leave request?
            </p>


            {/* Buttons */}

            <div
              className="
                flex
                flex-col-reverse
                sm:flex-row
                justify-end
                gap-2
                sm:gap-3
              "
            >

              {/* Cancel */}

              <button
                onClick={closeConfirmation}
                className="
                  px-4
                  py-2
                  rounded-lg
                  border
                  border-gray-300
                  text-gray-700
                  text-sm
                  hover:bg-gray-100
                  transition
                  w-full
                  sm:w-auto
                "
              >
                Cancel
              </button>


              {/* Confirm */}

              <button
                onClick={confirmAction}
                className={`
                  px-4
                  py-2
                  rounded-lg
                  text-white
                  text-sm
                  transition
                  w-full
                  sm:w-auto
                  ${
                    confirmation.type === "approve"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  }
                `}
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