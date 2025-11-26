// src/components/MobileSchedule.jsx
import { statusConfig } from "../data/statusConfig";
import { typeColors } from "../data/typeColors";

export default function MobileSchedule({ scheduleData, onSelectEvent }) {
  if (!scheduleData || scheduleData.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No events for this date.
      </p>
    );
  }

  // Achata: lista de eventos com info da sala junto
  const flatEvents = scheduleData.flatMap((room) =>
    room.events.map((ev) => ({
      ...ev,
      roomName: room.room,
      meta: room.meta || null,
    }))
  );

  return (
    <div className="space-y-4">
      {flatEvents.map((ev) => {
        const statusMeta = statusConfig[ev.status] || statusConfig.confirmed;
        const StatusIcon = statusMeta.icon;
        const typeColor = typeColors[ev.type] || typeColors.other;

        return (
          <button
            key={ev.id}
            type="button"
            onClick={() => onSelectEvent && onSelectEvent(ev)}
            className="
              w-full text-left bg-white border border-gray-200 rounded-lg 
              shadow-sm px-4 py-3 
              flex flex-col gap-2
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003366]
            "
          >
            {/* Linha superior: horário + status */}
            <div className="flex items-center justify-between gap-2 text-xs text-gray-600">
              <span className="font-medium">
                {ev.start_local} – {ev.end_local}
              </span>

              <span className="inline-flex items-center justify-center bg-white border border-gray-300 rounded-full w-7 h-7 shadow-sm">
                <StatusIcon
                  className="w-4 h-4"
                  style={{ color: statusMeta.color }}
                  aria-hidden="true"
                />
              </span>
            </div>

            {/* Título do evento */}
            <p className="text-sm font-semibold text-gray-900 leading-snug">
              {ev.title}
            </p>

            {/* Sala + meta */}
            <div className="flex flex-col gap-1 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800">
                  {ev.roomName}
                </span>
              </div>

              {ev.meta && (
                <div className="text-[11px] text-gray-500">
                  {ev.meta.capacity && <span>{ev.meta.capacity}</span>}
                  {ev.meta.capacity && ev.meta.area && <span> — </span>}
                  {ev.meta.area && <span>{ev.meta.area}</span>}
                </div>
              )}
            </div>

            {/* Type + Security em badges simples */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {/* Type com bolinha colorida */}
              <span className="inline-flex items-center gap-2 text-[11px] text-gray-700">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: typeColor }}
                  aria-hidden="true"
                />
                <span className="capitalize">
                  {ev.type}
                </span>
              </span>

              {/* Security */}
              <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {ev.security === "restricted" ? "Restricted" : "Open"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
