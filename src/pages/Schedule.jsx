// src/pages/Schedule.jsx
import { useMemo, useState, useEffect } from "react";
import { scheduleEvents } from "../data/schedule";
import Timeline from "../components/Timeline";
import PopupDetails from "../components/PopupDetails";
import MobileSchedule from "../components/MobileSchedule";

/* -----------------------------
   META DAS SALAS
----------------------------- */
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
  bilateral: { capacity: "Bilateral", area: "Area B" }
};

/* -----------------------------
   NORMALIZAÇÃO DOS EVENTOS
----------------------------- */
function normalizeEvent(ev) {
  const start = new Date(ev.start);
  const end = new Date(ev.end);
  const pad = (n) => String(n).padStart(2, "0");

  return {
    ...ev,
    date: ev.start.split("T")[0],
    start_local: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
    end_local: `${pad(end.getHours())}:${pad(end.getMinutes())}`,
  };
}

/* -----------------------------
   FORMATOS DE DATA
----------------------------- */
function formatDateShort(dateStr) {
  const [y, m, d] = dateStr.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d} ${months[Number(m) - 1]} ${y}`;
}

function formatDateLong(dateStr) {
  const [y, m, d] = dateStr.split("-");
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const num = Number(d);
  const suffix =
    num === 1 || num === 21 || num === 31 ? "st" :
    num === 2 || num === 22 ? "nd" :
    num === 3 || num === 23 ? "rd" : "th";

  return `${months[Number(m) - 1]} ${num}${suffix}, ${y}`;
}

/* -----------------------------
   COMPONENTE PRINCIPAL
----------------------------- */
export default function Schedule() {

  /* -----------------------------
     Responsividade via matchMedia
  ----------------------------- */
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

  /* -----------------------------
     Normalização
  ----------------------------- */
  const normalized = useMemo(
    () => scheduleEvents.map(normalizeEvent),
    []
  );

  const allDates = [...new Set(normalized.map((ev) => ev.date))];

  const [date, setDate] = useState(allDates[0] || "");
  const [roomFilter, setRoomFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [securityFilter, setSecurityFilter] = useState("all");
  const [recordOnly, setRecordOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  /* -----------------------------
     Listas de selects
  ----------------------------- */
  const roomsList = useMemo(() => {
    const map = new Map();
    normalized.forEach((ev) => map.set(ev.roomId, ev.roomName));
    return [...map.entries()];
  }, [normalized]);

  const typesList = useMemo(
    () => [...new Set(normalized.map((ev) => ev.type))],
    [normalized]
  );

  /* -----------------------------
     Aplicação de filtros
  ----------------------------- */
  const filteredEvents = useMemo(() => {
    return normalized.filter((ev) => {
      if (ev.date !== date) return false;
      if (roomFilter !== "all" && ev.roomId !== roomFilter) return false;
      if (typeFilter !== "all" && ev.type !== typeFilter) return false;
      if (securityFilter !== "all" && ev.security !== securityFilter) return false;
      if (recordOnly && !ev.options?.record) return false;
      return true;
    });
  }, [normalized, date, roomFilter, typeFilter, securityFilter, recordOnly]);

  /* -----------------------------
     Monta estrutura por sala
  ----------------------------- */
  const scheduleData = useMemo(() => {
    const map = new Map();

    filteredEvents.forEach((ev) => {
      if (!map.has(ev.roomId)) {
        map.set(ev.roomId, {
          roomId: ev.roomId,
          room: ev.roomName,
          meta: ROOM_META[ev.roomId] || null,
          events: []
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

  const dateLabel = date ? formatDateLong(date) : "";

  /* -----------------------------
     RENDER
  ----------------------------- */
  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 py-6">

      {/* Layout de filtros + timeline */}
      <div className="flex gap-6 flex-col xl:flex-row transition-all duration-700 ease-in-out">

        {/* ----------- FILTROS ----------- */}
        {(!isMobile || filtersOpen) && (
          <aside
            className={`
              bg-white border border-gray-200 rounded-lg shadow-sm p-6 h-fit shrink-0
              w-full            
              xl:w-72          
              transition-all duration-700 ease-in-out
              ${!isMobile && !filtersOpen ? 
                "xl:w-0 xl:opacity-0 xl:p-0 xl:border-0 xl:shadow-none" 
                : ""}
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
                  <h2 className="text-sm font-semibold text-gray-900">Filters</h2>

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
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Date</label>
                  <select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    {allDates.map((d) => (
                      <option key={d} value={d}>{formatDateShort(d)}</option>
                    ))}
                  </select>
                </div>

                {/* Room */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Room</label>
                  <select
                    value={roomFilter}
                    onChange={(e) => setRoomFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="all">All rooms</option>
                    {roomsList.map(([id, name]) => (
                      <option key={id} value={id}>{name}</option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="all">All types</option>
                    {typesList.map(t => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Security */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Security</label>
                  <select
                    value={securityFilter}
                    onChange={(e) => setSecurityFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="all">All</option>
                    <option value="open">Open</option>
                    <option value="restricted">Restricted</option>
                  </select>
                </div>

                {/* Recording only */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={recordOnly}
                    onChange={(e) => setRecordOnly(e.target.checked)}
                  />
                  Recording required only
                </label>

                {/* Clear filters */}
                <button
                  type="button"
                  onClick={() => {
                    setRoomFilter("all");
                    setTypeFilter("all");
                    setSecurityFilter("all");
                    setRecordOnly(false);
                  }}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Clear filters
                </button>
              </div>
            )}
          </aside>
        )}

        {/* ----------- TIMELINE / MOBILE LIST ----------- */}
        <div className="flex-1 w-full transition-all duration-700 ease-in-out">

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

          {isMobile ? (
            <MobileSchedule
              scheduleData={scheduleData}
              onSelectEvent={setSelectedEvent}
            />
          ) : (
            <Timeline
              scheduleData={scheduleData}
              dateLabel={dateLabel}
              onSelectEvent={setSelectedEvent}
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
