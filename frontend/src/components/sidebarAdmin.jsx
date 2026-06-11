import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/icons/asterism-logo-white.svg";

export default function SidebarAdmin({ activePage }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside className="w-64 bg-black text-white min-h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-4 flex flex-col items-center border-b border-gray-800">
        <img src={logo} alt="Asterism Logo" className="h-4 mb-0.5" />
        <span className="text-gray-400 text-[9px]">ADMIN PANEL</span>
      </div>

      <nav className="flex-1 py-4 px-3">
        <ul className="space-y-1.5">
          <li>
            <Link
              to="/ecommerce/admin/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
                activePage === "dashboard"
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span className="font-semibold tracking-wide text-[11px]">
                DASHBOARD
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/ecommerce/admin/products"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
                activePage === "products"
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                />
              </svg>
              <span className="font-semibold tracking-wide text-[11px]">
                PRODUCT MANAGEMENT
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/ecommerce/admin/orders"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
                activePage === "orders"
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <span className="font-semibold tracking-wide text-[11px]">
                ORDER MANAGEMENT
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/ecommerce/admin/payment-verification"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
                activePage === "payment"
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span className="font-semibold tracking-wide text-[11px]">
                PAYMENT VERIFICATION
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/ecommerce/admin/categories"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
                activePage === "categories"
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="font-semibold tracking-wide text-[11px]">
                CATEGORIES
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/ecommerce/admin/reports"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
                activePage === "reports"
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <span className="font-semibold tracking-wide text-[11px]">
                REPORTS
              </span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-300 hover:bg-white/5 hover:text-white transition-all w-full"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="font-semibold tracking-wide text-[11px]">
            LOGOUT
          </span>
        </button>
      </div>
    </aside>
  );
}
