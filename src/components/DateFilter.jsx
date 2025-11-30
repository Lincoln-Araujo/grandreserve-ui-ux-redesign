// src/components/DateFilter.jsx
import { useState, useEffect } from "react";
import {
  CalendarDaysIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function isoFromDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dateFromIso(iso) {
  // iso vem como "YYYY-MM-DD"
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatDisplay(iso) {
  if (!iso) return "";
  const d = dateFromIso(iso);
  if (!d) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const monthShort = MONTH_LABELS[d.getMonth()].slice(0, 3);
  const year = d.getFullYear();
  return `${day} ${monthShort} ${year}`;
}

export default function DateFilter({ label = "Date", value, onChange }) {
  const today = new Date();
  const parsed = dateFromIso(value) || today;

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(parsed.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed.getMonth());

  // Se o valor externo mudar, sincroniza o mês em exibição
  useEffect(() => {
    const d = dateFromIso(value);
    if (d) {
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setOpen(false);
    }
  };

  const goMonth = (delta) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  // Gera os dias do mês em grid 6x7 (sempre começa na segunda-feira)
  const daysGrid = (() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    // getDay: 0=Dom, 1=Seg... -> queremos 0=Seg, ..., 6=Dom
    const startOffset = (firstOfMonth.getDay() + 6) % 7;

    const cells = [];
    const totalCells = 42; // 6 semanas

    const selectedIso = value;
    const todayIso = isoFromDate(today);

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startOffset + 1;
      const dateObj = new Date(viewYear, viewMonth, dayNumber);
      const iso = isoFromDate(dateObj);
      const isCurrentMonth = dateObj.getMonth() === viewMonth;
      const isSelected = selectedIso === iso;
      const isToday = todayIso === iso;

      cells.push({
        key: iso,
        dateObj,
        label: dateObj.getDate(),
        isCurrentMonth,
        isSelected,
        isToday,
      });
    }

    return cells;
  })();

  const handleSelectDay = (dateObj) => {
    const iso = isoFromDate(dateObj);
    onChange(iso);
    setOpen(false);
  };

  const displayValue = formatDisplay(value) || "Select date";

  return (
    <div className="text-sm" onBlur={handleBlur}>
      <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
        {label}
      </label>

      {/* Botão "select" com ícone de calendário e chevron */}
      <div className="relative">
        <button
          type="button"
          className="
            w-full border border-gray-300 rounded
            px-3 pr-9 py-2 text-left
            flex items-center gap-2
            bg-white
            focus:outline-none focus:ring-2 focus:ring-[#003366]
          "
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <CalendarDaysIcon
            className="w-4 h-4 text-gray-400 flex-shrink-0"
            aria-hidden="true"
          />
          <span className="truncate text-xs text-gray-800">
            {displayValue}
          </span>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            <ChevronDownIcon className="w-4 h-4" />
          </span>
        </button>

        {/* Popup do calendário */}
        {open && (
          <div
            className="
              absolute z-40 mt-2
              bg-white border border-gray-200 rounded-xl
              shadow-[0_20px_60px_rgba(15,23,42,0.25)]
              p-3
              w-[280px]
            "
            role="dialog"
            aria-label="Choose date"
          >
            {/* Cabeçalho com mês/ano + navegação */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => goMonth(-1)}
                className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                aria-label="Previous month"
              >
                <ChevronLeftIcon className="w-4 h-4 text-[#003366]" />
              </button>

              <div className="text-sm font-semibold text-gray-900">
                {MONTH_LABELS[viewMonth]} {viewYear}
              </div>

              <button
                type="button"
                onClick={() => goMonth(1)}
                className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                aria-label="Next month"
              >
                <ChevronRightIcon className="w-4 h-4 text-[#003366]" />
              </button>
            </div>

            {/* Cabeçalho dos dias da semana */}
            <div className="grid grid-cols-7 gap-1 mb-1 text-[11px] font-semibold text-gray-400 text-center">
              {WEEKDAY_LABELS.map((wd) => (
                <div key={wd}>{wd}</div>
              ))}
            </div>

            {/* Grid de dias */}
            <div className="grid grid-cols-7 gap-1 text-xs">
              {daysGrid.map((day) => {
                const {
                  key,
                  dateObj,
                  label: dayLabel,
                  isCurrentMonth,
                  isSelected,
                  isToday,
                } = day;

                let base =
                  "w-8 h-8 flex items-center justify-center rounded-full transition text-xs";

                if (isSelected) {
                  base +=
                    " bg-[#0050b3] text-white font-semibold shadow-sm";
                } else if (!isCurrentMonth) {
                  base +=
                    " text-gray-300 hover:bg-gray-50";
                } else {
                  base +=
                    " text-gray-800 hover:bg-gray-100";
                }

                if (isToday && !isSelected) {
                  base +=
                    " border border-[#0050b3]/40";
                }

                return (
                  <button
                    key={key}
                    type="button"
                    className={base}
                    onClick={() => handleSelectDay(dateObj)}
                  >
                    {dayLabel}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
