// src/components/Header.jsx
import { useState, useRef, useEffect } from "react";
import {
  BellIcon,
  XMarkIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import bg from "../assets/header-bg.jpg";
import logoUNFCCC from "../assets/UNFCCC_logo.svg";

const BODY_BG = "#f5f7fa";

// Lista estática só para demonstração (Today / Yesterday + timestamps)
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    isNew: true,
    group: "Today",
    time: "2 min ago",
    content: (
      <>
        <span className="font-semibold">Plenary – Amazonas</span> session{" "}
        <span className="font-medium">“High-level segment (HLS)”</span> was{" "}
        <span className="text-amber-700 font-semibold">updated</span>.
      </>
    ),
  },
  {
    id: 2,
    isNew: true,
    group: "Today",
    time: "10 min ago",
    content: (
      <>
        <span className="font-semibold">UNFCCC daily press briefing</span>{" "}
        start time changed to <strong>11:30</strong>.
      </>
    ),
  },
  {
    id: 3,
    isNew: true,
    group: "Yesterday",
    time: "Yesterday • 18:40",
    content: (
      <>
        <span className="font-semibold">New side event</span> added in{" "}
        <span className="font-medium">Meeting Room 19</span>.
      </>
    ),
  },
  {
    id: 4,
    isNew: false,
    group: "Yesterday",
    time: "Yesterday • 16:05",
    content: (
      <>
        <span className="font-semibold">Coordination Room – Area C</span>{" "}
        status changed from{" "}
        <span className="font-medium">Pending</span> to{" "}
        <span className="font-medium">Confirmed</span>.
      </>
    ),
  },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hasUnread, setHasUnread] = useState(
    INITIAL_NOTIFICATIONS.some((n) => n.isNew)
  );

  const unreadCount = notifications.filter((n) => n.isNew).length;

  const notifRef = useRef(null);
  const userRef = useRef(null);

  // marca tudo como lido
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isNew: false }))
    );
    setHasUnread(false);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        if (showNotifications) {
          markAllAsRead();
        }
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]); // markAllAsRead usa setters estáveis, então tá ok

  const isActive = (path) => location.pathname === path;

  const go = (path) => {
    navigate(path);
    setShowNotifications(false);
    setShowUserMenu(false);
  };

  const TabButton = ({ path, label, Icon }) => (
    <button
      type="button"
      onClick={() => go(path)}
      className={`
        px-4 py-2 sm:px-4 sm:py-3
        text-xs sm:text-sm font-medium transition
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
      <div className="flex items-center justify-center gap-2">
        {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
        <span className="hidden sm:inline">{label}</span>
        <span className="sr-only sm:hidden">{label}</span>
      </div>
    </button>
  );

  return (
    <header
      className="relative z-30 text-white overflow-visible"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label="GrandReserva header"
    >
      <div className="bg-[#000]/50 backdrop-blur-[10px] relative overflow-visible">
        <div className="w-full mx-auto px-6 pt-4 pb-0 flex flex-col gap-6 max-w-[1600px] overflow-visible">
          {/* Linha 1: logo + usuário + notificações */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={logoUNFCCC}
                alt="UNFCCC"
                className="w-12 h-auto"
                draggable="false"
              />

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
                  className="relative flex p-1 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                  aria-label="Notifications – events were updated"
                  onClick={() => {
                    setShowNotifications((v) => !v);
                    setShowUserMenu(false);
                    setHasUnread(false); // some o pontinho assim que abre
                  }}
                >
                  <span className="relative inline-flex">
                    <BellIcon className="w-6 h-6" />
                    {hasUnread && (
                      <span className="absolute -top-1.5 -right-1.5 inline-flex h-2 w-2 rounded-full bg-amber-400" />
                    )}
                  </span>
                </button>

                {/* Balão flutuante só no desktop, enquanto houver unread */}
                {hasUnread && unreadCount > 0 && (
                  <div className="hidden sm:block absolute top-8 right-1 pointer-events-none z-30">
                    <div className="relative inline-flex items-center">
                      <div className="flex gap-1 bg-amber-400/90 text-[#3b2b00] text-[9px] font-medium rounded-full px-2 py-0 shadow-md whitespace-nowrap backdrop-blur-[1px] bg-opacity-[0.8]">
                        <div className="font-bold">{unreadCount}</div>
                        events had updates
                      </div>
                      <div className="absolute top-0 right-4 -translate-y-1/2 w-2 h-2 bg-amber-400/90 rotate-45" />
                    </div>
                  </div>
                )}

                {/* Dropdown de notificações */}
                {showNotifications && (
                  <div
                    className="
                      absolute right-0 mt-3 w-[min(90vw,22rem)]
                      bg-white text-gray-900
                      rounded-2xl border border-slate-200
                      shadow-[0_20px_60px_rgba(15,23,42,0.35)]
                      ring-1 ring-black/5
                      z-[9999] overflow-hidden
                    "
                    role="status"
                    aria-label="Recent schedule changes"
                  >
                    {/* Cabeçalho */}
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700">
                        Recent updates
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNotifications(false);
                          markAllAsRead();
                        }}
                        className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                        aria-label="Close notifications"
                      >
                        <XMarkIcon className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>

                    {/* Lista agrupada */}
                    <ul className="text-[13px] max-h-60 overflow-y-auto">
                      {["Today", "Yesterday"].map((groupLabel) => {
                        const groupItems = notifications.filter(
                          (n) => n.group === groupLabel
                        );
                        if (!groupItems.length) return null;

                        return (
                          <li key={groupLabel}>
                            <div className="px-4 pt-3 pb-1 border-b border-gray-100 bg-gray-50">
                              <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                {groupLabel}
                              </span>
                            </div>

                            <ul>
                              {groupItems.map((notif) => {
                                const isHighlighted =
                                  notif.isNew &&
                                  (hasUnread || showNotifications);

                                return (
                                  <li
                                    key={notif.id}
                                    className={`
                                      px-4 py-2.5 border-b border-gray-200 last:border-b-0
                                      ${
                                        isHighlighted
                                          ? "bg-amber-50"
                                          : "bg-white"
                                      }
                                    `}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1">
                                        <p
                                          className={`leading-snug ${
                                            isHighlighted
                                              ? "text-gray-900"
                                              : "text-gray-600"
                                          }`}
                                        >
                                          {notif.content}
                                        </p>
                                        <p className="mt-1 text-[11px] text-gray-400">
                                          {notif.time}
                                        </p>
                                      </div>

                                      {isHighlighted && (
                                        <span
                                          className="
                                            ml-2 mt-0.5 inline-flex items-center
                                            rounded-full px-2 py-0.5
                                            text-[11px] font-medium
                                            bg-amber-100 text-amber-900
                                            border border-amber-200
                                          "
                                        >
                                          New
                                        </span>
                                      )}
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </li>
                        );
                      })}
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
                  className={`
                    flex items-center gap-2
                    px-1.5 py-1 rounded-full
                    hover:bg-white/10
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white
                    sm:px-3 sm:py-1.5
                    sm:bg-black/20 sm:hover:bg-black/30
                    sm:border sm:border-white/15
                  `}
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

          {/* Linha divisória só no mobile */}
          <div
            className="mt-2 h-px w-full bg-white/30 sm:hidden"
            aria-hidden="true"
          />

          {/* Linha 2: abas + info conferência */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4">
            <p
              className="
                text-sm sm:text-[11px] text-white/90
                text-center sm:text-right
                sm:order-2
              "
            >
              <span className="block sm:inline font-semibold">
                Belém Climate Change Conference 2025
              </span>
              <span className="flex-inline">
                <span className="hidden sm:inline mx-1">•</span>
                City Park / Hangar Convention and Exhibition Center
              </span>
            </p>

            <nav
              className="flex flex-wrap gap-2 shrink-0 sm:order-1"
              aria-label="Main navigation"
            >
              <TabButton
                path="/schedule"
                label="Schedule"
                Icon={CalendarDaysIcon}
              />
              <TabButton
                path="/meetings"
                label="Meetings"
                Icon={UserGroupIcon}
              />
              <TabButton
                path="/account"
                label="My account"
                Icon={UserCircleIcon}
              />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
