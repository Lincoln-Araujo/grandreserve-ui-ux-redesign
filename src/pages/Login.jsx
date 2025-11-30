import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/login-bg.jpg";
import logoUNFCCC from "../assets/UNFCCC_logo.svg";
import logoUNFCCCblue from "../assets/UNFCCC_logo-blue.svg";

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (user.trim() && pass.trim()) {
      navigate("/meetings");
    }
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="min-h-screen bg-[#000]/60 backdrop-blur-[10px] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl mx-auto grid gap-10 md:grid-cols-2 items-center">
          
          {/* Coluna institucional – desktop */}
          <section className="hidden md:flex flex-col justify-center text-white/90 pr-4">
            <div className="flex items-center gap-3">
              <img
                src={logoUNFCCC}
                alt="UNFCCC"
                className="w-14 h-auto"
                draggable="false"
              />

              <div>
                <h1 className="text-2xl font-semibold leading-snug">
                  GrandReserva
                </h1>
                <p className="text-sm text-white/80">
                  UNFCCC – Scheduling &amp; Meetings
                </p>
              </div>
            </div>
            

            <div className="mt-6 text-sm text-white/80 space-y-1">
              <p className="font-semibold">
                Belém Climate Change Conference 2025
              </p>
              <p className="text-white/70">
                City Park / Hangar Convention and Exhibition Center
              </p>
            </div>

            <p className="mt-6 text-xs text-white/60 max-w-sm leading-relaxed">
              Secure access for authorized users to manage conference meetings,
              room allocations and daily schedule updates.
            </p>
          </section>

          {/* Card de login */}
          <section
            className="
              bg-white text-gray-900 rounded-2xl shadow-xl
              p-6 sm:p-8
              flex flex-col justify-center
            "
            aria-label="Login"
          >
            {/* Branding – sempre visível */}
            <div className="mb-6 md:mb-8 text-center block sm:hidden">
              <img
                src={logoUNFCCCblue}
                alt="UNFCCC"
                className="w-14 h-auto mx-auto mb-3 opacity-90"
                draggable="false"
              />
              <h1 className="text-xl font-semibold">GrandReserva</h1>
              <p className="text-xs text-gray-500 mt-1">
                UNFCCC – Scheduling &amp; Meetings
              </p>
            </div>

            <h2 className="text-lg font-semibold mb-1">
              Sign in to your account
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              For demonstration only — you may log in using any username and password 
              (e.g., “user” / “123456”).
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
                  className="
                    w-full px-3 py-2.5 rounded-lg border border-gray-300
                    text-sm
                    focus:outline-none focus:ring-2 focus:ring-[#003366]
                  "
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
                  className="
                    w-full px-3 py-2.5 rounded-lg border border-gray-300
                    text-sm
                    focus:outline-none focus:ring-2 focus:ring-[#003366]
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  mt-2 w-full py-2.5
                  rounded-full
                  bg-[#003366] text-white text-sm font-medium
                  hover:bg-[#00254d]
                  transition
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003366]
                "
              >
                Login
              </button>
            </form>

            <div className="flex items-center justify-between mt-4 text-xs">
              <button
                type="button"
                className="text-[#003366] hover:underline"
              >
                Forgot password?
              </button>

              <span className="text-gray-400">
                UNFCCC · COP30 · 2025
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
