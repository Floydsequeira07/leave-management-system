import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";

function ApplyLeave() {
  const navigate = useNavigate();

  const [leaveType, setLeaveType] = useState("casual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/");
      return;
    }

    if (!startDate || !endDate || !reason) {
      toast.error("Please fill all fields");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date cannot be before start date");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/leaves", {
        user_id: user.id,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason: reason,
      });

      toast.success("Leave applied successfully");

      setTimeout(() => {
        navigate("/employee");
      }, 1000);

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed to apply leave"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <Toaster position="top-right" />

      {/* Navbar */}
      <nav className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center">

        <h1 className="text-xl font-bold">
          Leave Management System
        </h1>

        <button
          onClick={() => navigate("/employee")}
          className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50"
        >
          Back to Dashboard
        </button>

      </nav>

      {/* Form */}
      <div className="max-w-2xl mx-auto p-6">

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Apply for Leave
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            Submit your leave request for approval.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >

            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave Type
              </label>

              <Select
  options={[
    { value: "casual", label: "Casual Leave" },
    { value: "sick", label: "Sick Leave" },
    { value: "earned", label: "Earned Leave" },
  ]}
  defaultValue={{
    value: "casual",
    label: "Casual Leave",
  }}
  onChange={(selectedOption) =>
    setLeaveType(selectedOption.value)
  }
  styles={{
    control: (base, state) => ({
      ...base,
      minHeight: "46px",
      borderColor: state.isFocused
        ? "#a855f7"
        : "#d1d5db",
      boxShadow: state.isFocused
        ? "0 0 0 2px #e9d5ff"
        : "none",
      "&:hover": {
        borderColor: "#a855f7",
      },
      padding: "3px",
      borderRadius: "8px",
      outline: "none",
      fontSize: "14px",
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#a855f7"
        : state.isFocused
        ? "#f3e8ff"
        : "white",
      color: state.isSelected
        ? "white"
        : "black",
      cursor: "pointer",
      fontSize: "14px",
      padding: "10px 12px",
    }),

    singleValue: (base) => ({
      ...base,
      fontSize: "14px",
      color: "#111827",
    }),

    dropdownIndicator: (base) => ({
      ...base,
      color: "#6b7280",
      "&:hover": {
        color: "#a855f7",
      },
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    menu: (base) => ({
      ...base,
      borderRadius: "8px",
      overflow: "hidden",
      marginTop: "4px",
    }),
  }}
/>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason
              </label>

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for leave"
                rows="4"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition font-medium"
            >
              Apply Leave
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default ApplyLeave;