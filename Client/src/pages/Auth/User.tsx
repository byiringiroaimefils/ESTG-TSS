import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";

const API_URL = import.meta.env.VITE_API_URL;

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

function User() {
  const navigate = useNavigate();
  const location = useLocation();
  const [Form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // ✅ Show success message if redirected with a message
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message, { position: "bottom-right" });
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // ✅ On mount, check if user already has an active session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(`${API_URL}/account/dashboard`, {
          withCredentials: true,
        });
        if (res.status === 200 && res.data?.user) {
          navigate("/adminpanel");
        }
      } catch {
        // not logged in → stay on login
      } finally {
        setIsCheckingSession(false);
      }
    };
    checkSession();
  }, [navigate]);

  const handleBack = () => {
    navigate("/admin");
  };

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/account/creator/login`,
        {
          email: Form.email,
          password: Form.password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Login successful!", { position: "bottom-right" });
        navigate("/adminpanel");
      } else {
        toast.error("Login failed. Please try again.", {
          position: "bottom-right",
        });
      }
    } catch (error: any) {
      console.error("Error during login:", error);

      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Invalid credentials. Please try again.", {
            position: "bottom-right",
          });
        } else {
          toast.error(
            `Error: ${error.response.data?.message || "Server error occurred."}`,
            { position: "bottom-right" }
          );
        }
      } else if (error.request) {
        toast.error(
          "No response from server. Please check your internet connection.",
          { position: "bottom-right" }
        );
      } else {
        toast.error("An unexpected error occurred.", {
          position: "bottom-right",
        });
      }
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <p className="text-gray-600 dark:text-gray-300">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
      {/* 🔍 SEO + Social Media Meta Tags */}
      <Helmet>
        <title>Admin Panel | ESTG-TSS</title>
        <meta
          name="description"
          content="Manage updates, events, and content creators from the admin panel of ESTG-TSS."
        />
        <meta property="og:title" content="Admin Panel | ESTG-TSS" />
        <meta
          property="og:description"
          content="Control content and users from the admin panel of ESTG-TSS."
        />
        <meta
          property="og:url"
          content="https://estg-tss.vercel.app/admin"
        />
        <meta
          property="og:image"
          content="https://estg-tss.vercel.app/assets/hero_image.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Admin Panel | ESTG-TSS" />
        <meta
          name="twitter:description"
          content="Control content and users from the admin panel of ESTG-TSS."
        />
        <meta
          name="twitter:image"
          content="https://estg-tss.vercel.app/assets/hero_image.jpg"
        />
      </Helmet>

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>

      {/* Login Form */}
      <div className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 p-8 rounded-lg shadow-sm shadow-gray-400 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 ">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Content Creator Login
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Please enter your credentials to continue
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleForm}>
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  value={Form.email}
                  onChange={(e) =>
                    setForm({ ...Form, email: e.target.value })
                  }
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="contentcreator@example.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  value={Form.password}
                  onChange={(e) =>
                    setForm({ ...Form, password: e.target.value })
                  }
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="••••••••"
                />
              </div>

              {/* Remember Me + Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
                <div>
                  <a
                    href="/forgetpassword"
                    className="text-blue-400 hover:underline"
                  >
                    Forget password
                  </a>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Sign In
              </button>
            </div>

            {/* Switch to Admin Login */}
            <div className="text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Login as admin?{" "}
              </span>
              <Link
                to="/admin"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default User;
