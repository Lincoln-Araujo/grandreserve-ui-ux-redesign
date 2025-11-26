import { useState, useMemo } from "react";
import { meetings } from "../data/meetings.js";
import PopupDetails from "../components/PopupDetails.jsx";
import EventCard from "../components/EventCard.jsx";

function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Meetings() {
  const [date, setDate] = useState("2025-11-17");
  const [roomFilter, setRoomFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [securityFilter, setSecurityFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [selected, setSelected] = useState(null);

  const roomsList = useMemo(() => {
    const map = new Map();
    meetings.forEach((m) => map.set(m.roomId, m.roomName));
    return Array.from(map.entries());
  }, []);

  const filtered = useMemo(() => {
    return meetings.filter((m) => {
      if (m.date !== date) return false;
      if (roomFilter !== "all" && m.roomId !== roomFilter) return false;
      if (typeFilter !== "all" && m.type !== typeFilter) return false;
      if (securityFilter !== "all" && m.security !== securityFilter) return false;
      return true;
    });
  }, [date, roomFilter, typeFilter, securityFilter]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 py-6">
      <header className="mb-4">
        <h1 className="text-lg font-semibold text-gray-900">Meetings</h1>
        <p className="text-sm text-gray-600">
          Tabular or card view of meetings for{" "}
          <span className="font-semibold">{formatDateLabel(date)}</span>.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        {/* SIDEBAR FILTROS */}
        <aside
          className="md:w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-5"
          aria-label="Meetings filters"
        >
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Filters</h2>

          <div className="space-y-3 text-sm">
            <div>
              <label
                htmlFor="meetings-date"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1"
              >
                Date
              </label>
              <input
                id="meetings-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                Room
              </label>
              <select
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
              >
                <option value="all">All rooms</option>
                {roomsList.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
              >
                <option value="all">All types</option>
                <option value="plenary">Plenary</option>
                <option value="press">Press conference</option>
                <option value="side">Side event</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                Security
              </label>
              <select
                value={securityFilter}
                onChange={(e) => setSecurityFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
              >
                <option value="all">All levels</option>
                <option value="open">Open</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setRoomFilter("all");
                setTypeFilter("all");
                setSecurityFilter("all");
              }}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#003366]"
            >
              Clear filters
            </button>
          </div>
        </aside>

        {/* CONTEÚDO */}
        <section className="flex-1 flex flex-col gap-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <span className="text-xs text-gray-600">
              Showing{" "}
              <span className="font-semibold">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "meeting" : "meetings"}.
            </span>

            <div className="inline-flex rounded-full border border-gray-300 overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 text-xs ${
                  viewMode === "table"
                    ? "bg-[#003366] text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`px-3 py-1 text-xs ${
                  viewMode === "cards"
                    ? "bg-[#003366] text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                Cards
              </button>
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow-sm border border-gray-200"
            aria-label="Meetings list"
          >
            {/* TABLE DESKTOP */}
            {viewMode === "table" && (
              <div className="hidden md:block overflow-x-auto rounded-lg">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        #
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Title
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Room
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Date
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Start
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        End
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Type
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Security
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((m, idx) => {
                      const start = new Date(m.start);
                      const end = new Date(m.end);
                      const timeStart = start.toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      const timeEnd = end.toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      const isRestricted = m.security === "restricted";

                      return (
                        <tr
                          key={m.id}
                          className={`
                            border-t border-gray-100 hover:bg-blue-50 cursor-pointer
                            ${m.updated ? "bg-amber-50 border-l-4 border-l-amber-400" : ""}
                          `}
                          onClick={() => setSelected(m)}
                        >
                          <td className="px-5 py-4 align-middle text-xs text-gray-600">
                            {idx + 1}
                          </td>
                          <td className="px-5 py-4 align-middle">
                            <span className="block text-sm font-semibold text-gray-900">
                              {m.title}
                            </span>
                          </td>
                          <td className="px-5 py-4 align-middle text-xs text-gray-800">
                            {m.roomName}
                          </td>
                          <td className="px-5 py-4 align-middle text-xs text-gray-800">
                            {formatDateLabel(m.date)}
                          </td>
                          <td className="px-5 py-4 align-middle text-xs text-gray-800">
                            {timeStart}
                          </td>
                          <td className="px-5 py-4 align-middle text-xs text-gray-800">
                            {timeEnd}
                          </td>
                          <td className="px-5 py-4 align-middle text-xs text-gray-800 capitalize">
                            {m.type}
                          </td>
                          <td className="px-5 py-4 align-middle">
                            <span
                              className={`text-xs font-medium ${
                                isRestricted ? "text-red-700" : "text-green-700"
                              }`}
                            >
                              {isRestricted ? "Restricted" : "Open"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* CARDS (desktop e mobile) */}
            {viewMode === "cards" && (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((m) => (
                  <EventCard
                    key={m.id}
                    event={m}
                    variant="grid"
                    colored={false}
                    onClick={() => setSelected(m)}
                  />
                ))}
              </div>
            )}

            {/* Mobile sempre cards se viewMode === table */}
            {viewMode === "table" && (
              <div className="md:hidden p-4 space-y-3">
                {filtered.map((m) => (
                  <EventCard
                    key={m.id}
                    event={m}
                    variant="list"
                    colored={false}
                    onClick={() => setSelected(m)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <PopupDetails event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
