// src/components/Filters.jsx
import { useState } from "react";

export default function Filters({ filters, setFilters }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <aside
      className={`
        transition-all duration-700 ease-in-out
        ${isOpen ? "w-64 opacity-100" : "w-0 opacity-0 pointer-events-none"}
        overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm p-4
      `}
    >
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          absolute -right-12 top-4 z-50 bg-white border border-gray-300 
          rounded-md py-1 px-3 text-sm shadow hover:bg-gray-50
        "
      >
        {isOpen ? "Hide filters" : "Show filters"}
      </button>

      {isOpen && (
        <div className="space-y-5">
          <h3 className="font-semibold text-gray-700 text-lg">Filters</h3>

          {/* DATE */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 shadow-sm"
            />
          </div>

          {/* ROOM */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Room</label>
            <select
              value={filters.room}
              onChange={(e) => handleChange("room", e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 shadow-sm"
            >
              <option value="">All rooms</option>
              <option value="plenary-amazonas">Plenary – Amazonas</option>
              <option value="plenary-tocantins">Plenary – Tocantins</option>
              <option value="press-1">Press Room 1</option>
              <option value="press-2">Press Room 2</option>
              <option value="meeting-19">Meeting Room 19</option>
            </select>
          </div>

          {/* TYPE */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 shadow-sm"
            >
              <option value="">All types</option>
              <option value="plenary">Plenary</option>
              <option value="press">Press Conference</option>
              <option value="side">Side Event</option>
            </select>
          </div>

          {/* SECURITY */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Security</label>
            <select
              value={filters.security}
              onChange={(e) => handleChange("security", e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 shadow-sm"
            >
              <option value="">All</option>
              <option value="open">Open</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>

          {/* RECORDING */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.recordOnly}
              onChange={(e) => handleChange("recordOnly", e.target.checked)}
            />
            <label className="text-sm text-gray-700">
              Recording required only
            </label>
          </div>
        </div>
      )}
    </aside>
  );
}
