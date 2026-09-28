import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const options = [
    { value: "employee", label: "Employee" },
    { value: "admin", label: "Admin" },
  ];

  const validate = () => {
    let valid = true;

    setEmailError("");
    setPasswordError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
  if (!validate()) return;

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email,
        password,
        role,
      }
    );

    // Save token and user information
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    toast.success(`${res.data.user.role} login successful`);

    setTimeout(() => {
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    }, 1000);

  } catch (err) {
    toast.error(
      err.response?.data?.message || "Invalid Credentials"
    );
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center px-4 md:px-6 py-6">

      <Toaster position="top-right" />

      {/* MAIN CONTAINER */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          w-full
          max-w-[760px]
          bg-white
          rounded-3xl
          overflow-hidden
          shadow-2xl
        "
      >

        {/* ================= LEFT SIDE ================= */}

        <div
          className="
            w-full
            md:w-[320px]
            bg-purple-600
            text-white
            p-10
            flex
            flex-col
            justify-center
            relative
            overflow-hidden
          "
        >

          {/* Background decoration */}

          <div className="absolute top-10 left-10 w-40 h-40 bg-purple-400 rounded-full opacity-30 blur-3xl"></div>

          <div className="absolute bottom-10 right-10 w-52 h-52 bg-pink-400 rounded-full opacity-20 blur-3xl"></div>


          <div className="relative z-10">

            {/* Logo */}

            <div className="text-5xl mb-6">
              📋
            </div>


            {/* Heading */}

            <h1 className="text-2xl font-bold mb-4">
              Leave Management
              <br />
              System
            </h1>


            {/* Description */}

            <p className="text-sm text-purple-100 leading-6">
              Manage employee leaves, approvals
              and leave balances with a simple
              and efficient management system.
            </p>


            {/* Features */}

            <div className="mt-8 space-y-3">

              <div className="bg-white/20 p-2 rounded-lg text-sm backdrop-blur-sm">
                📝 Apply Leave Easily
              </div>

              <div className="bg-white/20 p-2 rounded-lg text-sm backdrop-blur-sm">
                ✅ Quick Leave Approval
              </div>

              <div className="bg-white/20 p-2 rounded-lg text-sm backdrop-blur-sm">
                📊 Track Leave Balance
              </div>

            </div>

          </div>

        </div>


        {/* ================= RIGHT SIDE ================= */}

        <div
          className="
            flex-1
            p-6
            md:p-10
            md:pt-16
          "
        >

          {/* Heading */}

          <h1 className="text-3xl font-bold text-center mb-6 text-purple-600">
            Welcome Back
          </h1>

          <p className="text-gray-500 text-sm text-center mb-6">
            Login to continue to your dashboard
          </p>


          {/* FORM */}

          <div className="flex flex-col gap-4">

            {/* ================= ROLE ================= */}

            <Select
              options={options}
              defaultValue={options[0]}
              onChange={(selectedOption) =>
                setRole(selectedOption.value)
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


            {/* ================= EMAIL ================= */}

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              className="
                border
                border-gray-300
                p-3
                rounded-lg
                outline-none
                focus:border-purple-500
                focus:ring-2
                focus:ring-purple-200
                transition
                w-full
                pr-12
                text-sm
              "
              onChange={(e) => setEmail(e.target.value)}
            />

            {emailError && (
              <p className="text-red-500 text-sm -mt-3">
                {emailError}
              </p>
            )}


            {/* ================= PASSWORD ================= */}

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                className="
                  border
                  border-gray-300
                  p-3
                  rounded-lg
                  outline-none
                  focus:border-purple-500
                  focus:ring-2
                  focus:ring-purple-200
                  transition
                  w-full
                  pr-12
                  text-sm
                "
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Eye */}

              <button
                type="button"
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-purple-600
                  transition
                "
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <FaEyeSlash size={16} />
                ) : (
                  <FaEye size={16} />
                )}
              </button>

            </div>

            {passwordError && (
              <p className="text-red-500 text-sm -mt-3">
                {passwordError}
              </p>
            )}


            {/* ================= LOGIN ================= */}

            <button
              onClick={handleLogin}
              className="
                bg-purple-600
                hover:bg-purple-700
                text-white
                p-3
                rounded-lg
                transition
                shadow-md
                hover:shadow-lg
                text-sm
              "
            >
              Login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;