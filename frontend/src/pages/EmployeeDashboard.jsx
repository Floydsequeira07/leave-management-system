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
    }, 5000);

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

    {/* ================= TITLE ================= */}

    <h1
      className="
        text-xl
        sm:text-xl
        font-bold
        leading-tight
        text-center
        md:text-left
        whitespace-nowrap
      "
    >
      Leave Management System
    </h1>


    {/* ================= RIGHT SIDE ================= */}

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


      {/* Buttons */}

      <div className="flex items-center gap-2 sm:gap-3">

        {/* Apply Leave */}

        <button
          onClick={() => navigate("/apply-leave")}
          className="
            bg-white
            text-purple-600
            px-4
            py-2
            rounded-lg
            text-sm
            font-medium
            hover:bg-purple-50
            transition
            flex
            items-center
            justify-center
            gap-2
            whitespace-nowrap
          "
        >
          <FaCalendarPlus size={15} />
          Apply Leave
        </button>


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

  </div>
</nav>


      {/* ================= MAIN CONTENT ================= */}

      <div className="p-4 sm:p-6">

        {/* ================= WELCOME ================= */}

        <div className="mb-5 sm:mb-6">

          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Employee Dashboard
          </h2>

          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Manage your leave requests and leave balance.
          </p>

        </div>


        {/* ================= LEAVE BALANCE ================= */}

        <h3 className="text-lg font-semibold mb-4">
          Leave Balance
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

          {/* ================= CASUAL LEAVE ================= */}

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


          {/* ================= SICK LEAVE ================= */}

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


          {/* ================= EARNED LEAVE ================= */}

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


          {/* ================= UNPAID LEAVE ================= */}

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


        {/* ================= LEAVE HISTORY ================= */}

        <div className="bg-white rounded-xl shadow p-4 sm:p-5">

          <h3 className="text-lg font-semibold mb-4">
            Recent Leave Requests
          </h3>


          {leaves.length === 0 ? (

            <p className="text-gray-500 text-sm sm:text-base">
              No leave requests yet.
            </p>

          ) : (

            /*
              Only the table scrolls horizontally on small screens.
              The rest of the dashboard remains responsive.
            */

            <div className="w-full overflow-x-auto">

              <table className="w-full min-w-[700px] text-sm">

                <thead>

                  <tr className="border-b text-left">

                    <th className="p-3 whitespace-nowrap">
                      Leave Type
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
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {leaves.map((leave) => (

                    <tr
                      key={leave.id}
                      className="border-b"
                    >

                      <td className="p-3 capitalize whitespace-nowrap">
                        {leave.leave_type}
                      </td>


                      <td className="p-3 whitespace-nowrap">
                        {leave.start_date}
                      </td>


                      <td className="p-3 whitespace-nowrap">
                        {leave.end_date}
                      </td>


                      <td
                        className="
                          p-3
                          max-w-[250px]
                          truncate
                        "
                        title={leave.reason || "-"}
                      >
                        {leave.reason || "-"}
                      </td>


                      <td className="p-3">

                        <div className="flex items-center gap-2 capitalize whitespace-nowrap">

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