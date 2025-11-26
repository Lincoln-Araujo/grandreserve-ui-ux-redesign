// src/components/Timeline.jsx
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { typeColors } from "../data/typeColors";
import { statusConfig } from "../data/statusConfig";

export default function Timeline({ scheduleData, onSelectEvent, dateLabel }) {
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

  // Horas dinâmicas com base no menor/maior horário
  const { hoursDisplay, dayStartHour, totalMinutes } = useMemo(() => {
    let minH = Infinity;
    let maxH = -Infinity;

    allEvents.forEach((ev) => {
      const start = new Date(ev.start);
      const end = new Date(ev.end);
      minH = Math.min(minH, start.getHours());
      maxH = Math.max(maxH, end.getHours());
    });

    if (!isFinite(minH) || !isFinite(maxH)) {
      return {
        hoursDisplay: [],
        dayStartHour: 8,
        totalMinutes: 600,
      };
    }

    const startHour = Math.floor(minH);
    const endHour = Math.ceil(maxH + 1); // +1h pra respiro

    const hours = [];
    for (let h = startHour; h <= endHour; h++) {
      hours.push(h);
    }

    const display = hours.slice(0, -1); // intervalos [h, h+1)

    return {
      hoursDisplay: display,
      dayStartHour: startHour,
      totalMinutes: (endHour - startHour) * 60,
    };
  }, [allEvents]);

  const formatHour = (h) => `${String(h).padStart(2, "0")}:00`;

  const getBlockStyle = (ev) => {
    const start = new Date(ev.start);
    const end = new Date(ev.end);

    const startMin =
      (start.getHours() - dayStartHour) * 60 + start.getMinutes();
    const endMin =
      (end.getHours() - dayStartHour) * 60 + end.getMinutes();

    const left = (startMin / totalMinutes) * 100;
    const width = ((endMin - startMin) / totalMinutes) * 100;

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
  
    // HORIZONTAL
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
    const statusMeta = statusConfig[ev.status] || statusConfig.confirmed;

    const optionsList = [];
    if (ev.options?.record) optionsList.push("Record");
    if (ev.options?.webcast) optionsList.push("Webcast");
    if (ev.options?.archive) optionsList.push("Archive");
    const optionsText =
      optionsList.length > 0 ? optionsList.join(" • ") : "No special requirements";

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

  return (
    <div className="w-full">
      {/* Data + Show legend */}
      <div className="flex items-center justify-between mb-3">
        <div className="mb-0">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Schedule for 
            {" " + dateLabel}
          </h2>
          <p className="text-sm text-gray-600">
            Unified schedule for all rooms and event types
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowLegend((v) => !v)}
          className="text-xs sm:text-sm px-3 py-1.5 border border-gray-300 rounded-full bg-white hover:bg-gray-50 shadow-sm transition-all duration-700 ease-in-out"
        >
          {showLegend ? "Hide legend" : "Show legend"}
        </button>
      </div>

      {/* Legend colapsável (mantida onde estava) */}
      <div
        className={`overflow-hidden transition-all duration-700 ease-in-out ${
          showLegend ? "max-h-[420px] opacity-100 mb-4" : "max-h-0 opacity-0 mb-0"
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

            {/* Status em colunas */}
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

      {/* Contêiner principal */}
      <div className="w-full overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
        <div className="min-w-[900px]">
                    {/* Linhas por sala */}
          {scheduleData.map((room) => (
            <div
              key={room.roomId || room.room}
              className="border-b border-gray-100 last:border-b-0"
            >
              {/* Coluna sala */}
              <div className="flex items-center gap-2 w-100  px-3 py-4 pb-0 text-sm text-gray-800">
                <div className="font-medium">{room.room}</div>
                <span className="text-xs text-gray-600">|</span>
                {room.meta && (
                  <div className="text-xs text-gray-600 mt-">
                    {room.meta.capacity && (
                      <span>{room.meta.capacity}</span>
                    )}
                    {room.meta.capacity && room.meta.area && (
                      <span> — </span>
                    )}
                    {room.meta.area && <span>{room.meta.area}</span>}
                  </div>
                )}
              </div>

              {/* Timeline da sala */}
              <div className="flex-1 px-3 py-4 pr-4">
                {/* Blocos + grid */}
                <div className="relative h-10">
                  {/* grid cinza alinhado aos blocos */}
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

                  {/* blocos */}
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
                        {/* Badge de status dentro do bloco */}
                        <span className="absolute bottom-1 right-1 inline-flex items-center justify-center bg-white border border-gray-300 rounded-full w-6 h-6 shadow-sm">
                          <StatusIcon
                            className="w-4 h-4"
                            style={{ color: statusMeta.color }}
                            aria-hidden="true"
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Horas embaixo dos blocos (podem quebrar no mobile) */}
                <div className="mt-3 flex flex-wrap text-[11px] text-gray-600">
                  {hoursDisplay.map((h) => (
                    <div
                      key={`hour-${room.room}-${h}`}
                      className="flex-1 min-w-[48px] text-center"
                    >
                      {formatHour(h)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip via portal */}
      {renderTooltip()}
    </div>
  );
}
