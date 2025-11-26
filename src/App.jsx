import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Schedule from "./pages/Schedule.jsx";
import Meetings from "./pages/Meetings.jsx";
import Account from "./pages/Account.jsx";
import Header from "./components/Header.jsx";

function LayoutWithHeader({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="w-full max-w-[1800px] mx-auto">{children}</main>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/login";

  return (
    <>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Schedule */}
        <Route
          path="/schedule"
          element={
            <LayoutWithHeader>
              <Schedule />
            </LayoutWithHeader>
          }
        />

        {/* Meetings */}
        <Route
          path="/meetings"
          element={
            <LayoutWithHeader>
              <Meetings />
            </LayoutWithHeader>
          }
        />

        {/* My account (placeholder) */}
        <Route
          path="/account"
          element={
            <LayoutWithHeader>
              <Account />
            </LayoutWithHeader>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={isAuthPage ? "/login" : "/schedule"} />} />
      </Routes>
    </>
  );
}
