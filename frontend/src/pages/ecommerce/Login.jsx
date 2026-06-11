import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavbarAuth from "../../components/NavbarAuth.jsx";
import Footer from "../../components/Footer.jsx";
import bgImage from "../../assets/image 56.png";

const API_URL = "http://localhost:3001/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (location.state?.mode === "register") {
      setIsLogin(false);
    }
  }, [location.state]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Untuk register
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const body = isLogin
        ? { email, password }
        : { username, email, password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Simpan token dan seluruh data user ke localStorage
      if (data.data.token) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
      }

      alert(
        isLogin
          ? "Login successful!"
          : "Registration successful! Please login.",
      );

      if (isLogin) {
        // Cek apakah user admin dari email atau user_group_id
        const isAdminUser =
          data.data.email === "admin@asterism.com" ||
          data.data.user_group_id === 1;

        if (isAdminUser) {
          navigate("/ecommerce/admin/dashboard");
        } else {
          navigate("/ecommerce");
        }
      } else {
        // Switch ke tab login setelah register sukses
        setIsLogin(true);
        setUsername("");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* NavbarAuth */}
      <NavbarAuth />

      {/* Main Content */}
      <main className="flex-grow flex pt-32">
        {/* Left Side - Brand Section with Background Image (No Overlay) */}
        <section className="w-1/2 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${bgImage})`,
            }}
          ></div>
        </section>

        {/* Right Side - Form Section with Improved Spacing */}
        <section className="w-1/2 bg-white flex flex-col items-center justify-center px-12">
          <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-black tracking-widest">
                ASTERISM.IDN
              </h2>
            </div>

            {/* Tabs */}
            <div className="flex mb-8 border-b-2 border-gray-200">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 text-sm font-semibold tracking-wider transition-colors ${
                  isLogin
                    ? "text-black border-b-2 border-black -mb-[2px]"
                    : "text-gray-400"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 text-sm font-semibold tracking-wider transition-colors ${
                  !isLogin
                    ? "text-black border-b-2 border-black -mb-[2px]"
                    : "text-gray-400"
                }`}
              >
                Register
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                {error}
              </div>
            )}

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Username (hanya untuk register) */}
              {!isLogin && (
                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    USERNAME*
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-black text-sm text-black"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  EMAIL*
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-black text-sm text-black"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-black text-sm text-black"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {isLogin && (
                <>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-4 h-4 rounded-none border-gray-400 text-black focus:ring-0"
                    />
                    <label htmlFor="remember" className="text-xs text-gray-500">
                      Trust this device
                    </label>
                  </div>

                  <div className="text-xs text-gray-400 pl-7">
                    Save the verification token
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 text-sm font-semibold tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "PROCESSING..." : isLogin ? "LOGIN" : "REGISTER"}
              </button>

              {isLogin && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    className="text-xs font-semibold text-gray-600 underline underline-offset-4"
                  >
                    FORGOT PASSWORD?
                  </button>
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
