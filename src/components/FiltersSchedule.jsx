// src/components/FiltersSchedule.jsx
import { useState } from "react";

export default function FiltersSchedule({ filters, setFilters }) {
  const [open, setOpen] = useState(true);

  const updateFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <aside className="w-full md:w-64 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">

      {/* Collapse button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left text-sm font-semibold text-gray-700 mb-3 flex justify-between items-center"
      >
        Filters
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="space-y-4">

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <select
              value={filters.date}
              onChange={(e) => updateFilter("date", e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded text-sm"
            >
              {filters.availableDates.map((d) => (
                <option key={d} value={d}>
                  {new Date(d).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </option>
              ))}
            </select>
          </div>

          {/* Only recorded */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.recordOnly}
              onChange={(e) => updateFilter("recordOnly", e.target.checked)}
            />
            <label className="text-sm text-gray-700">Recording required only</label>
          </div>

        </div>
      )}
    </aside>
  );
}
