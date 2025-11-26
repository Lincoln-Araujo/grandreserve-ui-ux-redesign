import { useMemo, useState } from "react";
import { statusConfig } from "../data/statusConfig";
import { typeColors } from "../data/typeColors";

export default function Timeline({ events }) {
  const [hoverEvent, setHoverEvent] = useState(null);

  // -----------------------------------------------------------
  // 1) GROUP EVENTS BY ROOM – automatic grouping
  // -----------------------------------------------------------
  const rooms = useMemo(() => {
    if (!events) return [];

    const byRoom = {};
    events.forEach((ev) => {
      if (!byRoom[ev.roomId]) {
        byRoom[ev.roomId] = {
          roomId: ev.roomId,
          roomName: ev.roomName,
          capacity: ev.capacity || "—",
          area: ev.area || "—",
          events: [],
        };
      }
      byRoom[ev.roomId].events.push(ev);
    });

    return Object.values(byRoom);
  }, [events]);


  // -----------------------------------------------------------
  // 2) FIND MIN/MAX HOURS dynamically
  // -----------------------------------------------------------
  const { minHour, maxHour } = useMemo(() => {
    if (!events || events.length === 0)
      return { minHour: 7, maxHour: 20 };

    const hours = events.flatMap((ev) => [
      new Date(ev.start).getHours(),
      new Date(ev.end).getHours(),
    ]);

    return {
      minHour: Math.min(...hours) - 1,
      maxHour: Math.max(...hours) + 1,
    };
  }, [events]);


  // -----------------------------------------------------------
  // 3) BUILD HOURS ARRAY
  // -----------------------------------------------------------
  const hoursArray = useMemo(() => {
    const arr = [];
    for (let h = minHour; h <= maxHour; h++) arr.push(h);
    return arr;
  }, [minHour, maxHour]);


  // -----------------------------------------------------------
  // 4) POSITIONING LOGIC
  // -----------------------------------------------------------
  function getLeftPercent(dateStr) {
    const h = new Date(dateStr).getHours();
    return ((h - minHour) / (maxHour - minHour)) * 100;
  }

  function getWidthPercent(startStr, endStr) {
    const sh = new Date(startStr).getHours();
    const eh = new Date(endStr).getHours();
    return ((eh - sh) / (maxHour - minHour)) * 100;
  }


  // -----------------------------------------------------------
  // UI HELPER
  // -----------------------------------------------------------
  function formatHour(h) {
    return `${String(h).padStart(2, "0")}:00`;
  }


  // -----------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------
  return (
    <div className="w-full flex flex-col">

      {/* HOURS ROW */}
      <div className="relative w-full border-b border-gray-300 mb-2">
        <div className="flex">
          <div className="w-48"></div>
          <div className="flex-1 relative">
            {hoursArray.map((h) => (
              <div
                key={h}
                className="absolute text-xs text-gray-500"
                style={{
                  left: `${getLeftPercent(`${h}:00`) - 1}%`,
                  top: 0,
                }}
              >
                {formatHour(h)}
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* EACH ROOM */}
      {rooms.map((room) => (
        <div
          key={room.roomId}
          className="flex w-full items-start border-b border-gray-200 py-6 relative"
        >
          {/* LEFT SIDE – ROOM NAME + INFO */}
          <div className="w-48 pr-4 text-sm text-gray-700">
            <div className="font-semibold">{room.roomName}</div>
            <div className="text-gray-500">{room.capacity} — {room.area}</div>
          </div>

          {/* RIGHT SIDE – EVENT BLOCKS */}
          <div className="relative flex-1 h-20 bg-white">
            {room.events.map((ev) => {
              const left = getLeftPercent(ev.start);
              const width = getWidthPercent(ev.start, ev.end);

              const status = statusConfig[ev.status];
              const color = typeColors[ev.type]?.bg || "#888";

              return (
                <div
                  key={ev.id}
                  onMouseEnter={() => setHoverEvent(ev)}
                  onMouseLeave={() => setHoverEvent(null)}
                  className="
                    absolute h-6 rounded-md flex items-center justify-center text-white text-xs
                    shadow-md cursor-pointer transition
                  "
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    backgroundColor: color,
                    border: `2px solid ${status.color}`,
                  }}
                >
                  {status.icon}
                </div>
              );
            })}

            {/* HOUR GRID (30-minute columns) */}
            <div className="absolute inset-0 flex">
              {hoursArray.map((h) => (
                <div
                  key={`grid-${h}`}
                  className="flex-1 border-r border-gray-200/40"
                ></div>
              ))}
            </div>

          </div>
        </div>
      ))}

      {/* TOOLTIP */}
      {hoverEvent && (
        <div
          className="
            fixed z-50 bg-white shadow-lg border border-gray-300 p-3 rounded-md 
            text-sm w-64 animate-fadeIn pointer-events-none
          "
          style={{
            top: `${window.mouseY + 12}px`,
            left: `${window.mouseX + 12}px`,
          }}
        >
          <div className="font-semibold text-gray-800 mb-1">
            {hoverEvent.title}
          </div>
          <div className="text-gray-600">
            {formatHour(new Date(hoverEvent.start).getHours())} —{" "}
            {formatHour(new Date(hoverEvent.end).getHours())}
          </div>
        </div>
      )}
    </div>
  );
}
