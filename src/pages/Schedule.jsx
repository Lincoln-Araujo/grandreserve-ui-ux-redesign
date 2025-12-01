// src/pages/Schedule.jsx
import { useMemo, useState } from "react";
import { scheduleEvents } from "../data/schedule";
import Timeline from "../components/Timeline";
import PopupDetails from "../components/PopupDetails";
import MobileSchedule from "../components/MobileSchedule";
import { normalizeScheduleEvent } from "../utils/normalizeScheduleEvent";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import DateFilter from "../components/DateFilter";
import { formatDateLabel } from "../utils/dateUtils";
import { useIsMobile } from "../hooks/useIsMobile";

const ROOM_META = {
  "plenary-amazonas": { capacity: "1600 / 596", area: "Area E" },
  "plenary-tocantins": { capacity: "808 / 404", area: "Area D" },
  "press-1": { capacity: "Press Room 1", area: "Area D" },
  "press-2": { capacity: "Press Conference Room 2", area: "Area D" },
  "meeting-19": { capacity: "380 / 120", area: "Area D" },
  "meeting-5": { capacity: "120 / 60", area: "Area C" },
  "pavilion-a": { capacity: "Pavilion A", area: "Blue Zone" },
  "pavilion-b": { capacity: "Pavilion B", area: "Blue Zone" },
  "media-stakeout": { capacity: "Media Stakeout", area: "Press Area" },
  "un-room": { capacity: "UN / UNFCCC", area: "UN Hub" },
  coordination: { capacity: "120 / 80", area: "Coordination Area" },
  bilateral: { capacity: "Bilateral", area: "Area B" },
};

/* -----------------------------
   MultiSelect reutilizável (igual Meetings)
----------------------------- */
function MultiSelectFilter({ label, options, selected, onChange, allLabel }) {
  const [open, setOpen] = useState(false);

  const summaryLabel = useMemo(() => {
    if (!selected.length) return allLabel || "All";
    if (selected.length === 1) {
      const opt = options.find((o) => o.value === selected[0]);
      return opt ? opt.label : allLabel || "All";
    }
    return `${selected.length} selected`;
  }, [selected, options, allLabel]);

  const toggleValue = (value) => {
    onChange((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setOpen(false);
    }
  };

  return (
    <div className="text-sm" onBlur={handleBlur}>
      <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          className="
            w-full border border-gray-300 rounded 
            px-3 pr-9 py-2 text-left 
            flex items-center
            focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white
          "
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="truncate text-xs text-gray-800">
            {summaryLabel}
          </span>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            <ChevronDownIcon className="w-4 h-4" />
          </span>
        </button>

        {open && (
          <div
            className="
              absolute z-20 mt-1 w-full 
              bg-white border border-gray-200 rounded shadow-lg
              max-h-52 overflow-auto
            "
            role="listbox"
          >
            <button
              type="button"
              className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center justify-between"
              onClick={() => onChange([])}
            >
              <span>{allLabel || "All"}</span>
              {!selected.length && (
                <span className="text-[10px] text-gray-500">(current)</span>
              )}
            </button>

            <div className="border-t border-gray-100" />

            {options.map((opt) => {
              const checked = selected.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#003366] focus:ring-[#003366]"
                    checked={checked}
                    onChange={() => toggleValue(opt.value)}
                  />
                  <span className="truncate">{opt.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SingleSelectFilter({ label, options, value, onChange, Icon }) {
  const [open, setOpen] = useState(false);

  const currentLabel =
    options.find((opt) => opt.value === value)?.label ||
    options[0]?.label ||
    "";

  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setOpen(false);
    }
  };

  return (
    <div className="text-sm" onBlur={handleBlur}>
      <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          className="
            w-full border border-gray-300 rounded 
            px-3 pr-9 py-2 text-left 
            flex items-center
            focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white
          "
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <div className="flex items-center gap-2">
            {Icon && (
              <Icon className="w-4 h-4 text-gray-400" aria-hidden="true" />
            )}
            <span className="truncate text-xs text-gray-800">
              {currentLabel}
            </span>
          </div>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            <ChevronDownIcon className="w-4 h-4" />
          </span>
        </button>

        {open && (
          <div
            className="
              absolute z-20 mt-1 w-full 
              bg-white border border-gray-200 rounded shadow-lg
              max-h-52 overflow-auto
            "
            role="listbox"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`
                  w-full text-left px-3 py-2 text-xs 
                  flex items-center justify-between
                  hover:bg-gray-50
                  ${value === opt.value ? "bg-gray-50" : ""}
                `}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <span>{opt.label}</span>
                {value === opt.value && (
                  <span className="text-[10px] text-gray-500">
                    (current)
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* -----------------------------
   COMPONENTE PRINCIPAL
----------------------------- */
export default function Schedule() {
  const isMobile = useIsMobile();

  // Normalização
  const normalized = useMemo(
    () => scheduleEvents.map(normalizeScheduleEvent),
    []
  );

  const allDates = [...new Set(normalized.map((ev) => ev.date))];

  const [date, setDate] = useState(allDates[0] || "");
  const [roomFilter, setRoomFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);
  const [securityFilter, setSecurityFilter] = useState("all");
  const [recordOnly, setRecordOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Listas de selects
  const roomsList = useMemo(() => {
    const map = new Map();
    normalized.forEach((ev) => map.set(ev.roomId, ev.roomName));
    return [...map.entries()];
  }, [normalized]);

  const typesList = useMemo(
    () => [...new Set(normalized.map((ev) => ev.type))].sort(),
    [normalized]
  );

  const roomOptions = useMemo(
    () =>
      roomsList.map(([id, name]) => ({
        value: id,
        label: name,
      })),
    [roomsList]
  );

  const typeOptions = useMemo(
    () =>
      typesList.map((t) => ({
        value: t,
        label: t.charAt(0).toUpperCase() + t.slice(1),
      })),
    [typesList]
  );

  // Aplicação de filtros
  const filteredEvents = useMemo(() => {
    return normalized.filter((ev) => {
      if (ev.date !== date) return false;

      if (roomFilter.length && !roomFilter.includes(ev.roomId)) return false;
      if (typeFilter.length && !typeFilter.includes(ev.type)) return false;

      if (securityFilter !== "all" && ev.security !== securityFilter)
        return false;

      if (recordOnly && !ev.options?.record) return false;

      return true;
    });
  }, [normalized, date, roomFilter, typeFilter, securityFilter, recordOnly]);

  // Monta estrutura por sala
  const scheduleData = useMemo(() => {
    const map = new Map();

    filteredEvents.forEach((ev) => {
      if (!map.has(ev.roomId)) {
        map.set(ev.roomId, {
          roomId: ev.roomId,
          room: ev.roomName,
          meta: ROOM_META[ev.roomId] || null,
          events: [],
        });
      }
      map.get(ev.roomId).events.push(ev);
    });

    const arr = [...map.values()];

    arr.forEach((room) => {
      room.events.sort((a, b) => new Date(a.start) - new Date(b.start));
    });

    arr.sort((a, b) => a.room.localeCompare(b.room));

    return arr;
  }, [filteredEvents]);

  const dateLabel = date ? formatDateLabel(date) : "";
  const hasEvents = scheduleData.length > 0;

  const clearFilters = () => {
    setRoomFilter([]);
    setTypeFilter([]);
    setSecurityFilter("all");
    setRecordOnly(false);
  };

  const securityOptions = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "restricted", label: "Restricted" },
  ];

  // RENDER
  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 py-6">
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-lg font-semibold text-gray-900">Schedule</h1>
        <p className="text-sm text-gray-600">
          Schedule view of meetings for{" "}
          <span className="font-semibold">{dateLabel}</span>.
        </p>
      </header>

      {/* Layout filtros + timeline */}
      <div
        className={`
          flex flex-col xl:flex-row
          transition-all duration-700 ease-in-out
          ${filtersOpen ? "gap-6" : "gap-0"}
        `}
      >
        {/* ----------- FILTROS ----------- */}
        {(!isMobile || filtersOpen) && (
          <aside
            className={`
              bg-white rounded-lg shadow-sm h-fit shrink-0
              overflow-visible
              transition-[width,opacity,padding,border] duration-500 ease-in-out
              w-full
              static md:sticky md:top-6
              ${
                filtersOpen
                  ? "xl:w-72 xl:opacity-100 p-6 xl:p-6 xl:border xl:border-gray-200"
                  : "xl:w-0 xl:opacity-0 xl:p-0 xl:border-0 xl:shadow-none xl:pointer-events-none"
              }
            `}
          >
            {filtersOpen && (
              <div
                className="
                  space-y-4
                  md:space-y-0 md:grid md:grid-cols-2 md:gap-4
                  xl:flex xl:flex-col xl:space-y-4
                  text-sm
                "
              >
                {/* Cabeçalho */}
                <div className="flex items-center justify-between mb-2 col-span-2 xl:col-span-1">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Filters
                  </h2>

                  {/* Hide desktop */}
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="hidden xl:inline-flex text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Hide
                  </button>

                  {/* Hide mobile */}
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="xl:hidden text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Hide
                  </button>
                </div>

                {/* Date */}
                <DateFilter
                  label="Date"
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
                />

                {/* Room - multi */}
                <MultiSelectFilter
                  label="Room"
                  options={roomOptions}
                  selected={roomFilter}
                  onChange={setRoomFilter}
                  allLabel="All rooms"
                />

                {/* Type - multi */}
                <MultiSelectFilter
                  label="Type"
                  options={typeOptions}
                  selected={typeFilter}
                  onChange={setTypeFilter}
                  allLabel="All types"
                />

                {/* Security */}
                <SingleSelectFilter
                  label="Security"
                  options={securityOptions}
                  value={securityFilter}
                  onChange={setSecurityFilter}
                />

                {/* Recording only */}
                <label className="flex items-center gap-2 text-xs text-gray-700">
                  <input
                    type="checkbox"
                    checked={recordOnly}
                    onChange={(e) => setRecordOnly(e.target.checked)}
                    className="rounded border-gray-300 text-[#003366] focus:ring-[#003366]"
                  />
                  Recording required only
                </label>

                {/* Clear filters */}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Clear filters
                </button>
              </div>
            )}
          </aside>
        )}

        {/* ----------- TIMELINE / MOBILE LIST ----------- */}
        <div className="flex-1 w-full transition-all duration-700 ease-in-out timeline-component">
          {!filtersOpen && !isMobile && (
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="text-xs px-3 py-1 border border-gray-300 rounded mb-3 hover:bg-gray-50"
            >
              Show filters
            </button>
          )}

          {!filtersOpen && isMobile && (
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="text-xs px-3 py-1 border border-gray-300 rounded mb-3 w-full hover:bg-gray-50"
            >
              Show filters
            </button>
          )}

          {!hasEvents ? (
            <div className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg p-4">
              No events match the selected filters.
            </div>
          ) : isMobile ? (
            <MobileSchedule
              scheduleData={scheduleData}
              onSelectEvent={setSelectedEvent}
            />
          ) : (
            <Timeline
              scheduleData={scheduleData}
              onSelectEvent={setSelectedEvent}
              fullWidth={!filtersOpen && !isMobile}
            />
          )}
        </div>
      </div>

      {/* Painel lateral */}
      <PopupDetails
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
