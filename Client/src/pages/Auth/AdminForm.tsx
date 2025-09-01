import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const API_URL = import.meta.env.VITE_API_URL;

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

function AdminForm() {
  const navigate = useNavigate();

  const [Form, setForm] = React.useState({
    email: "",
    password: "",
  });

  const [errormsg, setErrormsg] = React.useState("");

  // ✅ Check session on mount using backend, not localStorage
  React.useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await axios.get(`${API_URL}/account/dashboard`, {
          withCredentials: true,
        });
        if (res.status === 200 && res.data?.role === "Admin") {
          navigate("/adminpanel");
        }
      } catch (error) {
        // Not logged in, ignore
      }
    };
    verifySession();
  }, [navigate]);

  const handleBack = () => {
    navigate("/");
  };

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrormsg(""); // clear old errors

    try {
      const response = await axios.post(
        `${API_URL}/account/admin/login`,
        {
          email: Form.email,
          password: Form.password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("Login successful", response.data);
        navigate("/adminpanel");
      } else {
        setErrormsg("Unexpected error. Please try again.");
      }
    } catch (error: any) {
      if (error.response) {
        const msg =
          error.response.data?.message ||
          "Login failed. Check your credentials.";
        setErrormsg(msg);
        console.error("Backend error:", error.response);
      } else if (error.request) {
        setErrormsg(
          "No response from server. Please check your connection or server."
        );
        console.error("No response error:", error.request);
      } else {
        setErrormsg("An unexpected error occurred.");
        console.error("Error", error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 🔍 SEO + Social Media Meta Tags */}
      <Helmet>
        <title>Admin Panel | ESTG-TSS</title>
        <meta
          name="description"
          content="Manage updates, events, and content creators from the admin panel of ESTG-TSS."
        />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Admin Panel | ESTG-TSS" />
        <meta
          property="og:description"
          content="Control content and users from the admin panel of ESTG-TSS."
        />
        <meta property="og:url" content="https://estg-tss.vercel.app/admin" />
        <meta
          property="og:image"
          content="https://estg-tss.vercel.app/assets/hero_image.jpg"
        />

        {/* Twitter Card Meta Tags */}
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

      {/* Back button */}
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

      {/* Centered Form */}
      <div className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 p-8 rounded-lg shadow-sm dark:shadow-[#333] shadow-gray-400 bg-white dark:bg-black border border-gray-200 dark:border-gray-700">
          {/* Form Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold dark:text-gray-200 text-gray-800">
              Admin Login
            </h1>
            <p className="mt-2 text-sm dark:text-gray-100 text-gray-800">
              Please enter your credentials
            </p>
          </div>

          {errormsg && <p className="text-red-500 text-center">{errormsg}</p>}

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleForm}>
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  value={Form.email}
                  onChange={(e) => setForm({ ...Form, email: e.target.value })}
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="admin@example.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
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

              {/* Extra Options */}
              <div className="flex justify-between md:flex-row flex-col gap-4">
                <div>
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember" className="pl-2 text-gray-700 dark:text-gray-300">
                    Remember Me
                  </label>
                </div>
                <div>
                  <a href="/forgetpassword" className="text-blue-400">
                    Forget password
                  </a>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>

            {/* Switch Login Type */}
            <div className="text-center text-sm mt-4">
              <span className="text-gray-600 dark:text-gray-400">
                Sign in as{" "}
              </span>
              <Link
                to="/user"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Content Creator
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminForm;
