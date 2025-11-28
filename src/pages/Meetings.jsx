// src/pages/Meetings.jsx
import { useState, useMemo, useEffect } from "react";
import { scheduleEvents } from "../data/schedule";
import PopupDetails from "../components/PopupDetails.jsx";
import EventCard from "../components/EventCard.jsx";
import { normalizeScheduleEvent } from "../utils/normalizeScheduleEvent";

const meetings = scheduleEvents.map(normalizeScheduleEvent);

/* --------------------------------
   MultiSelectFilter (Room / Type)
-----------------------------------*/
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
    // fecha o dropdown quando o foco sai de todo o componente
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
        {/* Botão que parece um select */}
        <button
          type="button"
          className="w-full border border-gray-300 rounded px-3 py-2 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="truncate text-xs text-gray-800">
            {summaryLabel}
          </span>
          <span
            aria-hidden="true"
            className="ml-2 text-gray-500 text-[10px]"
          >
            ▾
          </span>
        </button>

        {/* Painel com checkboxes */}
        {open && (
          <div
            className="
              absolute z-20 mt-1 w-full 
              bg-white border border-gray-200 rounded shadow-lg
              max-h-52 overflow-auto
            "
            role="listbox"
          >
            {/* “All” = limpar seleção */}
            <button
              type="button"
              className="
                w-full text-left px-3 py-2 text-xs
                hover:bg-gray-50 flex items-center justify-between
              "
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

/* --------------------------------
   Helpers de data
-----------------------------------*/
function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateRangeLabel(start, end) {
  if (!start && !end) return "";
  if (start === end) return formatDateLabel(start);
  if (!start) return `until ${formatDateLabel(end)}`;
  if (!end) return `from ${formatDateLabel(start)}`;
  return `${formatDateLabel(start)} – ${formatDateLabel(end)}`;
}

/* --------------------------------
   Componente principal
-----------------------------------*/
export default function Meetings() {
  // Responsividade (igual Schedule)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : false
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const listener = (e) => setIsMobile(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const [filtersOpen, setFiltersOpen] = useState(true);

  // Datas + filtros
  const allDates = useMemo(
    () =>
      [...new Set(meetings.map((m) => m.date))].sort((a, b) =>
        a.localeCompare(b)
      ),
    []
  );

  const defaultDate = allDates[0] || "";

  const [startDate, setStartDate] = useState(defaultDate);
  const [endDate, setEndDate] = useState(defaultDate);
  const [roomFilter, setRoomFilter] = useState([]);      // multi-select
  const [typeFilter, setTypeFilter] = useState([]);      // multi-select
  const [securityFilter, setSecurityFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState(null);

  // Listas auxiliares
  const roomsList = useMemo(() => {
    const map = new Map();
    meetings.forEach((m) => map.set(m.roomId, m.roomName));
    return Array.from(map.entries());
  }, []);

  const typesList = useMemo(
    () => [...new Set(meetings.map((m) => m.type))].sort(),
    []
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
  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return meetings.filter((m) => {
      // Intervalo de datas (inclusive)
      if (startDate && m.date < startDate) return false;
      if (endDate && m.date > endDate) return false;

      if (roomFilter.length && !roomFilter.includes(m.roomId)) return false;
      if (typeFilter.length && !typeFilter.includes(m.type)) return false;
      if (securityFilter !== "all" && m.security !== securityFilter) return false;

      if (term && !m.title.toLowerCase().includes(term)) return false;

      return true;
    });
  }, [startDate, endDate, roomFilter, typeFilter, securityFilter, searchTerm]);

  const dateRangeLabel = formatDateRangeLabel(startDate, endDate);

  const clearFilters = () => {
    // Respeita datas escolhidas; limpa apenas filtros de sala/tipo/security/busca
    setRoomFilter([]);
    setTypeFilter([]);
    setSecurityFilter("all");
    setSearchTerm("");
  };

  // Render
  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 py-6">
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-lg font-semibold text-gray-900">Meetings</h1>
        <p className="text-sm text-gray-600">
          Tabular or card view of meetings for{" "}
          <span className="font-semibold">
            {dateRangeLabel || "the selected period"}
          </span>
          .
        </p>
      </header>

      {/* Layout filtros + conteúdo (igual vibe da Schedule) */}
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
              bg-white rounded-lg shadow-sm h-fit shrink-0 overflow-hidden
              transition-[width,opacity,padding,border] duration-500 ease-in-out
              w-full
              xl:sticky xl:top-6
              ${
                filtersOpen
                  ? "xl:w-72 xl:opacity-100 p-6 xl:p-6 xl:border xl:border-gray-200"
                  : "xl:w-0 xl:opacity-0 xl:p-0 xl:border-0 xl:shadow-none xl:pointer-events-none"
              }
            `}
            aria-label="Meetings filters"
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
                {/* Cabeçalho filtros */}
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

                {/* Date range */}
                <div>
                  <label
                    htmlFor="meetings-start-date"
                    className="block text-xs font-semibold uppercase text-gray-600 mb-1"
                  >
                    Start date
                  </label>
                  <input
                    id="meetings-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      const value = e.target.value;
                      setStartDate(value);
                      if (endDate && value && value > endDate) {
                        setEndDate(value);
                      }
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="meetings-end-date"
                    className="block text-xs font-semibold uppercase text-gray-600 mb-1"
                  >
                    End date
                  </label>
                  <input
                    id="meetings-end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEndDate(value);
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>

                {/* Room (multi-select) */}
                <MultiSelectFilter
                  label="Room"
                  options={roomOptions}
                  selected={roomFilter}
                  onChange={setRoomFilter}
                  allLabel="All rooms"
                />

                {/* Type (multi-select) */}
                <MultiSelectFilter
                  label="Type"
                  options={typeOptions}
                  selected={typeFilter}
                  onChange={setTypeFilter}
                  allLabel="All types"
                />

                {/* Security */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                    Security
                  </label>
                  <select
                    value={securityFilter}
                    onChange={(e) => setSecurityFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  >
                    <option value="all">All levels</option>
                    <option value="open">Open</option>
                    <option value="restricted">Restricted</option>
                  </select>
                </div>

                {/* Clear filters */}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                >
                  Clear filters
                </button>
              </div>
            )}
          </aside>
        )}

        {/* ----------- CONTEÚDO ----------- */}
        <section className="flex-1 w-full transition-all duration-700 ease-in-out">
          {/* Botão para mostrar filtros quando estão escondidos */}
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

          {/* Barra de contagem + modo de visualização + busca */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <span
              className="text-xs text-gray-600"
              aria-live="polite"
            >
              Showing{" "}
              <span className="font-semibold">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "meeting" : "meetings"}.
            </span>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
              {/* Busca por título */}
              <div className="flex-1 sm:flex-none">
                <label
                  htmlFor="meetings-search"
                  className="sr-only"
                >
                  Search meetings by title
                </label>
                <input
                  id="meetings-search"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title"
                  className="w-full border border-gray-300 rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-0 focus:ring-[#003366]"
                />
              </div>

              <div
                aria-hidden="true"
                className="hidden sm:block w-px h-6 bg-gray-300"
              />

              {/* Toggle table/cards – só desktop */}
              <div className="hidden md:inline-flex rounded-full border border-gray-300 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  aria-pressed={viewMode === "table"}
                  className={`px-3 py-1 text-xs focus:outline-none ${
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
                  aria-pressed={viewMode === "cards"}
                  className={`px-3 py-1 text-xs focus:outline-none ${
                    viewMode === "cards"
                      ? "bg-[#003366] text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  Cards
                </button>
              </div>
            </div>
          </div>

          {/* Bloco principal */}
          <div
            className="bg-white rounded-lg shadow-sm border border-gray-200 mt-3"
            aria-label="Meetings list"
          >
            {/* Sem resultados */}
            {filtered.length === 0 && (
              <div className="p-6 text-sm text-gray-600">
                No meetings match the selected filters. Try adjusting the date
                range, filters, or search term.
              </div>
            )}

            {filtered.length > 0 && (
              <>
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
                            Status
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
                                ${
                                  m.updated
                                    ? "bg-amber-50 border-l-4 border-l-amber-400"
                                    : ""
                                }
                              `}
                              onClick={() => setSelected(m)}  // mouse: linha toda clicável
                            >
                              <td className="px-5 py-4 align-middle text-xs text-gray-600">
                                {idx + 1}
                              </td>

                              <td className="px-5 py-4 align-middle">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation(); // evita clique duplo vindo do <tr>
                                    setSelected(m);
                                  }}
                                  className="block text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003366] rounded-sm"
                                  aria-label={`Open details for ${m.title}, ${formatDateLabel(
                                    m.date
                                  )}, ${timeStart}–${timeEnd}, ${
                                    isRestricted ? "restricted" : "open"
                                  } meeting`}
                                >
                                  <span className="block text-sm font-semibold text-gray-900">
                                    {m.title}
                                  </span>
                                </button>
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
                              <td className="px-5 py-4 align-middle text-xs text-gray-800 capitalize">
                                <span className="text-xs text-gray-500 capitalize">
                                  {m.status}
                                </span>
                              </td>
                              <td className="px-5 py-4 align-middle">
                                <span
                                  className={`text-xs font-medium ${
                                    isRestricted
                                      ? "text-red-700"
                                      : "text-green-700"
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

                {/* CARDS DESKTOP (grid) */}
                {viewMode === "cards" && (
                  <div className="hidden md:grid p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((m) => (
                      <EventCard
                        key={m.id}
                        event={m}
                        onOpenDetails={setSelected}
                      />
                    ))}
                  </div>
                )}

                {/* Mobile: sempre cards em lista */}
                <div className="md:hidden p-4 space-y-3">
                  {filtered.map((m) => (
                    <EventCard
                      key={m.id}
                      event={m}
                      onOpenDetails={setSelected}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <PopupDetails event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
