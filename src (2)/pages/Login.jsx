import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/login-bg.jpg";

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (user.trim() && pass.trim()) {
      navigate("/schedule");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">GrandReserva</h1>
        <p className="text-center text-gray-600 mb-6 text-sm">
          UNFCCC | Secure scheduling access
        </p>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
          aria-label="Login form"
        >
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            className="mt-2 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <button className="text-sm text-blue-700 hover:underline">
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}
