import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../api";
import { getErrorMessage } from "../../utils/errorHandler";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await authService.adminLogin({
        email,
        password,
        rememberMe: remember,
      });

      // Determine storage based on "Remember me" checkbox
      const storage = remember ? localStorage : sessionStorage;

      // Store user profile and role-based flags (response.data contains admin info)
      storage.setItem("user", JSON.stringify(response.data));

      // Set isAdmin flag if user role is admin or superAdmin
      if (response.data?.role === "admin" || response.data?.role === "superAdmin") {
        storage.setItem("isAdmin", "1");
      } else {
        storage.removeItem("isAdmin");
      }

      // Always store role in localStorage for quick UI checks
      try {
        localStorage.setItem("userRole", response.data?.role || "user");
      } catch (e) {
        // Gracefully handle quota exceeded
      }

      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="max-w-sm w-full text-gray-600 space-y-5 bg-white p-6 rounded-lg shadow">
        <div className="text-center pb-4">
          <img src="/img/jkss_logo.png" width={150} className="mx-auto" />
          <div className="mt-4">
            <h3 className="text-[#035CB0] text-2xl font-bold sm:text-3xl">Admin Portal</h3>
            <p className="text-sm text-gray-500">Sign in to your admin account</p>
          </div>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-medium"> Email </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 px-3 py-2 text-gray-700 bg-white outline-none border focus:border-[#035CB0] shadow-sm rounded-lg"
            />
          </div>
          <div>
            <label className="font-medium"> Password </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 px-3 py-2 text-gray-700 bg-white outline-none border focus:border-[#035CB0] shadow-sm rounded-lg"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4"
              />
              <span>Remember me</span>
            </label>
            <span className="text-center text-red-600 hover:text-red-500 cursor-not-allowed" title="Coming soon">Forgot password?</span>
          </div>
          <div className="buttons flex justify-between items-center gap-1">
            <Link
              to="/"
              className="w-[100px] text-center px-4 py-2 text-white font-medium bg-[#035CB0] hover:text-yellow-400 active:bg-[#26445fe9] rounded-lg duration-150"
            >
              <i className="ri-home-4-line mr-1"></i>
              Home
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 px-4 py-2 text-white font-medium bg-red-600 hover:bg-red-500 active:bg-red-600 rounded-lg duration-150 disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Logging in..." : "LOG IN"}
            </button>
          </div>
        </form>
        
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-gray-600">
            Are you a student?{' '}
            <Link to="/student/login" className="font-medium text-blue-600 hover:text-blue-500">
              Student Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;