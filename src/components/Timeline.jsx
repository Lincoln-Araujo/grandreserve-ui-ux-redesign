// src/components/Timeline.jsx
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { typeColors } from "../data/typeColors";
import { statusConfig } from "../data/statusConfig";

export default function Timeline({
  scheduleData,
  onSelectEvent,
  fullWidth = false,
}) {
  const [showLegend, setShowLegend] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [isHoveringTooltip, setIsHoveringTooltip] = useState(false);

  const allEvents = useMemo(
    () => scheduleData.flatMap((room) => room.events),
    [scheduleData]
  );

  if (!allEvents.length) {
    return <p className="text-sm text-gray-500">No events for this date.</p>;
  }

  const totalEvents = allEvents.length;

  // -------------------------------------------------------------------
  // HORAS DINÂMICAS
  // -------------------------------------------------------------------
  const { hoursDisplay, dayStartHour, totalMinutes } = useMemo(() => {
    if (!allEvents.length) {
      return {
        hoursDisplay: [],
        dayStartHour: 8,
        totalMinutes: 720,
      };
    }

    let minStart = Infinity;
    let maxEnd = -Infinity;

    allEvents.forEach((ev) => {
      const start = new Date(ev.start);
      const end = new Date(ev.end);

      const startMinutes = start.getHours() * 60 + start.getMinutes();
      let endMinutes = end.getHours() * 60 + end.getMinutes();

      const crossesMidnight =
        end.getFullYear() !== start.getFullYear() ||
        end.getMonth() !== start.getMonth() ||
        end.getDate() !== start.getDate();

      if (crossesMidnight) {
        endMinutes += 24 * 60;
      }

      minStart = Math.min(minStart, startMinutes);
      maxEnd = Math.max(maxEnd, endMinutes);
    });

    if (!isFinite(minStart) || !isFinite(maxEnd)) {
      return {
        hoursDisplay: [],
        dayStartHour: 8,
        totalMinutes: 720,
      };
    }

    const dayStartHour = Math.floor(minStart / 60);
    const lastHour = Math.ceil(maxEnd / 60);
    const dayEndHour = Math.min(lastHour + 1, 24);

    const hoursDisplay = [];
    for (let h = dayStartHour; h < dayEndHour; h++) {
      hoursDisplay.push(h);
    }

    const totalMinutes = (dayEndHour - dayStartHour) * 60;

    return {
      hoursDisplay,
      dayStartHour,
      totalMinutes,
    };
  }, [allEvents]);

  const formatHour = (h) => `${String(h).padStart(2, "0")}:00`;

  const getBlockStyle = (ev) => {
    const start = new Date(ev.start);
    const end = new Date(ev.end);

    const startMin =
      (start.getHours() - dayStartHour) * 60 + start.getMinutes();
    let endMin =
      (end.getHours() - dayStartHour) * 60 + end.getMinutes();

    const crossesMidnight =
      end.getFullYear() !== start.getFullYear() ||
      end.getMonth() !== start.getMonth() ||
      end.getDate() !== start.getDate();

    if (crossesMidnight) {
      endMin += 24 * 60;
    }

    endMin = Math.min(endMin, totalMinutes);
    const duration = Math.max(endMin - startMin, 0);

    const left = (startMin / totalMinutes) * 100;
    const width = (duration / totalMinutes) * 100;

    return {
      left: `${left}%`,
      width: `${width}%`,
    };
  };

  const handleMouseEnter = (ev, domEvent) => {
    const rect = domEvent.currentTarget.getBoundingClientRect();

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const TOOLTIP_WIDTH = 320;
    const TOOLTIP_HEIGHT = 120;
    const HALF_TOOLTIP = TOOLTIP_WIDTH / 2;
    const MARGIN = 16;

    let center = rect.left + rect.width / 2;

    if (center < HALF_TOOLTIP + MARGIN)
      center = HALF_TOOLTIP + MARGIN;

    if (center > vw - HALF_TOOLTIP - MARGIN)
      center = vw - HALF_TOOLTIP - MARGIN;

    let top = rect.bottom + 12;

    if (top + TOOLTIP_HEIGHT + MARGIN > vh) {
      top = rect.top - TOOLTIP_HEIGHT + 24;
    }

    if (top < MARGIN) {
      top = MARGIN;
    }

    const docTop = top + scrollY;
    const docLeft = center + scrollX;

    setHovered({
      event: ev,
      top: docTop,
      left: docLeft,
    });
  };

  const handleMouseLeave = () => {
    setHovered(null);
  };

  const renderTooltip = () => {
    if (!hovered || typeof document === "undefined") return null;

    const { event: ev, top, left } = hovered;

    return createPortal(
      <div
        className="
          z-50 bg-[#003366] text-white text-xs
          px-4 py-3 rounded-md shadow-2xl w-72 max-w-[90vw]
          animate-fadeIn
        "
        style={{
          position: "absolute",
          top,
          left,
          transform: "translateX(-50%)",
        }}
        onMouseEnter={() => setIsHoveringTooltip(true)}
        onMouseLeave={() => {
          setIsHoveringTooltip(false);
          setHovered(null);
        }}
      >
        <p className="font-semibold text-[13px] mb-2 leading-snug">
          {ev.title}
        </p>

        <div className="space-y-1">
          <span>
            {ev.start_local} – {ev.end_local}
          </span>
        </div>
      </div>,
      document.body
    );
  };

  const legendId = "timeline-legend";

  // -------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------
  return (
    <div className={`${fullWidth ? "w-full" : "mx-auto"}`}>
      {/* Barra estilo Meetings: contagem + botão Show legend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
        <span className="text-xs text-gray-600" aria-live="polite">
          Showing{" "}
          <span className="font-semibold">{totalEvents}</span>{" "}
          {totalEvents === 1 ? "event" : "events"}.
        </span>

        <button
          type="button"
          onClick={() => setShowLegend((v) => !v)}
          className="text-xs sm:text-sm px-3 py-1.5 border border-gray-300 rounded-full bg-white hover:bg-gray-50 shadow-sm transition-all duration-700 ease-in-out"
          aria-expanded={showLegend}
          aria-controls={legendId}
        >
          {showLegend ? "Hide legend" : "Show legend"}
        </button>
      </div>

      {/* Legend */}
      <div
        id={legendId}
        className={`overflow-hidden transition-all duration-700 ease-in-out ${
          showLegend
            ? "max-h-[420px] opacity-100 mb-4"
            : "max-h-0 opacity-0 mb-0"
        }`}
      >
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Types */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Event types
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                {Object.entries(typeColors).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="capitalize text-gray-800">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Status
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {Object.entries(statusConfig).map(([key, meta]) => {
                  const Icon = meta.icon;
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center bg-white border border-gray-300 rounded-full w-7 h-7 shadow-sm">
                        <Icon
                          className="w-4 h-4"
                          style={{ color: meta.color }}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="text-gray-800 text-[13px]">
                        {meta.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div
        className="
          relative
          border border-gray-200 rounded-lg bg-white shadow-sm
          min-h-[320px]
          max-h-[calc(100vh-310px)]
          overflow-x-auto
          overflow-y-auto
        "
      >
        <div className="min-w-[900px]">
          {scheduleData.map((room) => (
            <div
              key={room.roomId || room.room}
              className="border-b border-gray-100 last:border-b-0"
            >
              {/* Room header */}
              <div className="flex items-center gap-2 w-100 px-3 py-4 pb-0 text-sm text-gray-800">
                <div className="font-medium">{room.room}</div>
                <span className="text-xs text-gray-600">|</span>
                {room.meta && (
                  <div className="text-xs text-gray-600">
                    {room.meta.capacity && <span>{room.meta.capacity}</span>}
                    {room.meta.capacity && room.meta.area && <span> — </span>}
                    {room.meta.area && <span>{room.meta.area}</span>}
                  </div>
                )}
              </div>

              {/* Timeline Row */}
              <div className="flex-1 px-3 py-4 pr-4">
                <div className="relative h-10">
                  {/* Background grid */}
                  <div className="absolute inset-0 flex">
                    {hoursDisplay.map((h, idx) => (
                      <div
                        key={`grid-${room.room}-${h}`}
                        className={`flex-1 border-l border-gray-100 bg-gray-50 ${
                          idx === 0 ? "border-l-0" : ""
                        }`}
                      />
                    ))}
                  </div>

                  {/* Event blocks */}
                  {room.events.map((ev) => {
                    const statusMeta =
                      statusConfig[ev.status] || statusConfig.confirmed;
                    const StatusIcon = statusMeta.icon;

                    return (
                      <button
                        key={ev.id}
                        type="button"
                        className="group absolute top-0 h-10 rounded-sm shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003366]"
                        style={{
                          ...getBlockStyle(ev),
                          backgroundColor:
                            typeColors[ev.type] || typeColors.other,
                        }}
                        onClick={() => onSelectEvent && onSelectEvent(ev)}
                        onMouseEnter={(e) => handleMouseEnter(ev, e)}
                        onMouseLeave={() => {
                          setTimeout(() => {
                            if (!isHoveringTooltip) setHovered(null);
                          }, 80);
                        }}
                        onFocus={(e) => handleMouseEnter(ev, e)}
                        onBlur={handleMouseLeave}
                        aria-label={`${ev.title}, ${statusMeta.label}, ${ev.start_local}–${ev.end_local}`}
                      >
                        <span className="absolute bottom-1 right-1 flex items-center justify-center bg-white border border-gray-300 rounded-full w-6 h-6 sm:w-5 sm:h-5 shadow-sm">
                          <StatusIcon
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            style={{ color: statusMeta.color }}
                            aria-hidden="true"
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Hour labels */}
                <div className="mt-3 flex text-[11px] text-gray-600">
                  {hoursDisplay.map((h) => (
                    <div
                      key={`hour-${room.room}-${h}`}
                      className="flex-1 min-w-[24px] text-center whitespace-nowrap"
                    >
                      {formatHour(h)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {renderTooltip()}
      </div>
    </div>
  );
}
