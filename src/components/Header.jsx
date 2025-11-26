// src/components/Header.jsx
import { useState, useRef, useEffect } from "react";
import { BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import bg from "../assets/header-bg.jpg";

const BODY_BG = "#f5f7fa";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const go = (path) => {
    navigate(path);
    setShowNotifications(false);
    setShowUserMenu(false);
  };

  const TabButton = ({ path, label }) => (
    <button
      type="button"
      onClick={() => go(path)}
      className={`
        px-4 py-2 text-sm font-medium transition
        border border-transparent border-b-0
        rounded-t-md
        ${
          isActive(path)
            ? "text-[#003366]"
            : "text-white/85 hover:bg-white/10"
        }
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white
      `}
      style={{
        backgroundColor: isActive(path) ? BODY_BG : "transparent",
      }}
      aria-current={isActive(path) ? "page" : undefined}
    >
      {label}
    </button>
  );

  return (
    <header
      className="relative text-white"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label="GrandReserva header"
    >
      <div className="bg-[#003366]/90">
        <div className="w-full mx-auto px-6 pt-4 pb-0 flex flex-col gap-3 max-w-[1600px]">
          {/* Linha 1: logo + usuário + notificações */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg font-semibold leading-tight">
                  GrandReserva
                </h1>
                <p className="text-xs text-white/80 leading-tight">
                  UNFCCC – Scheduling &amp; Meetings
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notificações */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  className="relative p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                  aria-label="Notifications"
                  onClick={() => {
                    setShowNotifications((v) => !v);
                    setShowUserMenu(false);
                    setHasUnread(false);
                  }}
                >
                  <BellIcon className="w-6 h-6" />
                  {hasUnread && (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex h-2 w-2 rounded-full bg-amber-400" />
                  )}
                </button>

                {showNotifications && (
                  <div
                    className="absolute right-0 mt-2 w-80 bg-white text-gray-900 rounded-lg shadow-md border border-gray-200 z-40 overflow-hidden"
                    role="status"
                    aria-label="Recent schedule changes"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700">
                        Recent updates
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowNotifications(false)}
                        className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                        aria-label="Close notifications"
                      >
                        <XMarkIcon className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <ul className="text-[13px] max-h-60 overflow-y-auto">
                      <li className="px-4 py-2.5 border-b border-gray-100">
                        <span className="font-semibold">Plenary – Amazonas</span>{" "}
                        session{" "}
                        <span className="font-medium">
                          “High-level segment (HLS)”
                        </span>{" "}
                        was <span className="text-amber-700">updated</span>.
                      </li>
                      <li className="px-4 py-2.5 border-b border-gray-100">
                        <span className="font-semibold">
                          UNFCCC daily press briefing
                        </span>{" "}
                        start time changed to <strong>11:30</strong>.
                      </li>
                      <li className="px-4 py-2.5">
                        <span className="font-semibold">New side event</span>{" "}
                        added in{" "}
                        <span className="font-medium">Meeting Room 19</span>.
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Usuário */}
              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu((v) => !v);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-black/20 rounded-[10px] hover:bg-black/30 border border-white/15 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                  aria-haspopup="true"
                  aria-expanded={showUserMenu}
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-semibold text-sm">
                    LA
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm leading-tight">
                      Lincoln Araujo
                    </span>
                    <span className="text-[11px] text-white/75 leading-tight">
                      Host Broadcaster
                    </span>
                  </div>
                </button>

                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-2 w-44 bg-white text-gray-900 rounded-lg shadow-md border border-gray-200 z-40 text-sm overflow-hidden"
                    role="menu"
                    aria-label="User menu"
                  >
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50"
                      onClick={() => go("/account")}
                    >
                      My account
                    </button>
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-red-600"
                      onClick={() => go("/login")}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Linha 2: abas + info conferência */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <nav
              className="flex flex-wrap gap-2"
              aria-label="Main navigation"
            >
              <TabButton path="/schedule" label="Schedule" />
              <TabButton path="/meetings" label="Meetings" />
              <TabButton path="/account" label="My account" />
            </nav>

            <p className="text-xs sm:text-sm text-white/90 text-right">
              <span className="font-semibold">
                Belém Climate Change Conference 2025
              </span>
              <span className="mx-1">•</span>
              <span>City Park / Hangar Convention and Exhibition Center</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
