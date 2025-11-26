// src/pages/Schedule.jsx
import { useState, useMemo } from "react";
import Filters from "../components/Filters";
import Timeline from "../components/Timeline";
import { scheduleEvents } from "../data/schedule";

export default function Schedule() {
  const [filters, setFilters] = useState({
    date: "2025-11-17",
    room: "",
    type: "",
    security: "",
    recordOnly: false,
  });

  const [showLegend, setShowLegend] = useState(false);

  // -------------------------
  // 🎯 FILTERED EVENTS
  // -------------------------
  const filteredEvents = useMemo(() => {
    return scheduleEvents.filter((ev) => {
      const evDate = ev.start.split("T")[0];

      if (filters.date && evDate !== filters.date) return false;
      if (filters.room && ev.roomId !== filters.room) return false;
      if (filters.type && ev.type !== filters.type) return false;
      if (filters.security && ev.security !== filters.security) return false;
      if (filters.recordOnly && !ev.options.record) return false;

      return true;
    });
  }, [filters]);

  // Format date in human-readable form
  const formattedDate = new Date(filters.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="w-full flex flex-col gap-6 px-6 pt-6 pb-20">

      {/* ---------------------------- */}
      {/*     PAGE HEADER AREA         */}
      {/* ---------------------------- */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Schedule for {formattedDate}
        </h1>

        <button
          onClick={() => setShowLegend((prev) => !prev)}
          className="
            bg-white border border-gray-300 px-4 py-2 rounded-md text-sm 
            hover:bg-gray-100 transition
          "
        >
          {showLegend ? "Hide legend" : "Show legend"}
        </button>
      </div>

      {/* ---------------------------- */}
      {/*     LEGEND PANEL (optional)  */}
      {/* ---------------------------- */}
      {showLegend && (
        <div
          className="
            border border-gray-300 rounded-lg bg-white p-4 shadow-sm 
            grid grid-cols-2 gap-4 animate-fadeIn
          "
        >
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Types</h3>
            <ul className="space-y-1 text-sm">
              <li>🔵 Plenary</li>
              <li>🟣 Press Conference</li>
              <li>🟢 Side Event</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Status</h3>
            <ul className="space-y-1 text-sm">
              <li>🟢 Confirmed</li>
              <li>🟡 Pending</li>
              <li>🔴 Blocked</li>
            </ul>
          </div>
        </div>
      )}

      {/* ---------------------------- */}
      {/*     MAIN GRID LAYOUT         */}
      {/* ---------------------------- */}
      <div className="flex gap-6 w-full">

        {/* FILTERS */}
        <Filters filters={filters} setFilters={setFilters} />

        {/* TIMELINE */}
        <div className="flex-1 overflow-x-auto min-h-[400px]">
          <Timeline events={filteredEvents} />
        </div>
      </div>
    </div>
  );
}
