import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCalendarPlus, FaSignOutAlt } from "react-icons/fa";

function EmployeeDashboard() {
  const [user, setUser] = useState(null);

  const [balance, setBalance] = useState({
    casual_total: 0,
    casual_leave: 0,
    sick_total: 0,
    sick_leave: 0,
    earned_total: 0,
    earned_leave: 0,
    unpaid_leave: 0,
  });

  const [leaves, setLeaves] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser) {
    navigate("/");
    return;
  }

  setUser(storedUser);

  // Fetch immediately
  fetchBalance(storedUser.id);
  fetchLeaves(storedUser.id);

  // Automatically fetch every 5 seconds
  const interval = setInterval(() => {
    fetchBalance(storedUser.id);
    fetchLeaves(storedUser.id);
  }, 1000);

  // Stop polling when leaving the page
  return () => {
    clearInterval(interval);
  };
}, []);

  const fetchBalance = async (userId) => {
    try {
      const res = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/leaves/balance/${userId}`
);

      console.log("BALANCE RESPONSE:", res.data);

      setBalance(res.data);
    } catch (error) {
      console.error("Balance error:", error);
    }
  };

  const fetchLeaves = async (userId) => {
    try {
       const res = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/leaves/my-leaves/${userId}`
);

      setLeaves(res.data);
    } catch (error) {
      console.error("Leaves error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
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
            onClick={() => navigate("/apply-leave")}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition flex items-center gap-2"
          >
            <FaCalendarPlus size={15} />
            Apply Leave
          </button>

          <button
            onClick={handleLogout}
            className="bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-800 transition flex items-center gap-2"
          >
            <FaSignOutAlt size={15} />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">

        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Employee Dashboard
          </h2>

          <p className="text-gray-500">
            Manage your leave requests and leave balance.
          </p>
        </div>

        {/* Leave Balance */}
        <h3 className="text-lg font-semibold mb-4">
          Leave Balance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

          {/* Casual Leave */}
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">
              Casual Leave
            </p>

            <h2 className="text-3xl font-bold text-purple-600 mt-2">
              {balance.casual_total}
            </h2>

            <p className="text-gray-400 text-xs">
              Total Days
            </p>

            <div className="mt-3 border-t pt-3">
              <p className="text-gray-500 text-sm">
                Remaining
              </p>

              <p className="text-xl font-semibold text-gray-800">
                {balance.casual_leave}
              </p>
            </div>
             <p className="text-gray-400 text-xs mt-1">
              Days
            </p>
          </div>

          {/* Sick Leave */}
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">
              Sick Leave
            </p>

            <h2 className="text-3xl font-bold text-purple-600 mt-2">
              {balance.sick_total}
            </h2>

            <p className="text-gray-400 text-xs">
              Total Days
            </p>

            <div className="mt-3 border-t pt-3">
              <p className="text-gray-500 text-sm">
                Remaining
              </p>

              <p className="text-xl font-semibold text-gray-800">
                {balance.sick_leave}
              </p>
            </div>
             <p className="text-gray-400 text-xs mt-1">
              Days
            </p>
          </div>

          {/* Earned Leave */}
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">
              Earned Leave
            </p>

            <h2 className="text-3xl font-bold text-purple-600 mt-2">
              {balance.earned_total}
            </h2>

            <p className="text-gray-400 text-xs">
              Total Days
            </p>

            <div className="mt-3 border-t pt-3">
              <p className="text-gray-500 text-sm">
                Remaining
              </p>

              <p className="text-xl font-semibold text-gray-800">
                {balance.earned_leave}
              </p>
            </div>
             <p className="text-gray-400 text-xs mt-1">
              Days
            </p>
          </div>

          {/* Unpaid Leave */}
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">
              Unpaid Leave (LOP)
            </p>

            <h2 className="text-3xl font-bold text-red-500 mt-2">
              {balance.unpaid_leave}
            </h2>

            <p className="text-gray-400 text-xs mt-1">
              Days
            </p>
          </div>

        </div>

        {/* Leave History */}
        <div className="bg-white rounded-xl shadow p-5">

          <h3 className="text-lg font-semibold mb-4">
            Recent Leave Requests
          </h3>

          {leaves.length === 0 ? (
            <p className="text-gray-500">
              No leave requests yet.
            </p>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>
                  <tr className="border-b text-left">
                    <th className="p-3">Leave Type</th>
                    <th className="p-3">Start Date</th>
                    <th className="p-3">End Date</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((leave) => (
                    <tr
                      key={leave.id}
                      className="border-b"
                    >
                      <td className="p-3 capitalize">
                        {leave.leave_type}
                      </td>

                      <td className="p-3">
                        {leave.start_date}
                      </td>

                      <td className="p-3">
                        {leave.end_date}
                      </td>

                      <td className="p-3">
                        {leave.reason || "-"}
                      </td>

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
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default EmployeeDashboard;