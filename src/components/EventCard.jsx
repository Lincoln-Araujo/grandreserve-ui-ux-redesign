// src/components/EventCard.jsx
import {
  typeColors as baseTypeColors,
} from "../data/typeColors";
import { statusConfig } from "../data/statusConfig";

function formatDateLabel(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${d} ${months[Number(m) - 1]} ${y}`;
}

function normalizeStatus(status) {
  if (!status) return "confirmed";
  return String(status).toLowerCase();
}

function normalizeOptions(value) {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  if (typeof value === "string") return [value];

  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([_, v]) => v === true || v === "true")
      .map(([k]) => k);
  }

  return [];
}

export default function EventCard({ event, onOpenDetails }) {
  const isUpdated = event.updated === true;

  // -----------------------------
  // Datas / horários
  // -----------------------------
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  const timeStart = startDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const timeEnd = endDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateLabel = formatDateLabel(event.date);

  // -----------------------------
  // Tipo (cor igual à timeline)
  // -----------------------------
  const typeKey = (event.type || "other").toLowerCase();
  const typeColor =
    baseTypeColors[typeKey] || baseTypeColors.other || "#374151";

  // -----------------------------
  // Status (config compartilhada)
  // -----------------------------
  const statusKey = normalizeStatus(event.status);
  const statusMeta =
    statusConfig[statusKey] || statusConfig.confirmed;
  const StatusIcon = statusMeta.icon;

  // -----------------------------
  // Segurança / opções
  // -----------------------------
  const isRestricted = event.security === "restricted";
  const safeOptions = normalizeOptions(event.options);

  // -----------------------------
  // Ações (click + teclado)
  // -----------------------------
  const handleActivate = () => {
    if (onOpenDetails) onOpenDetails(event);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate();
    }
  };

  const titleId = `event-card-title-${event.id}`;
  const srHintId = `event-card-hint-${event.id}`;

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      aria-labelledby={titleId}
      aria-describedby={srHintId}
      className={`
        border rounded-lg p-4 flex flex-col shadow-sm hover:shadow-md transition
        bg-white cursor-pointer relative h-full
        outline-none focus-visible:ring-2 focus-visible:ring-[#003366] focus-visible:ring-offset-2
        ${isUpdated ? "border-2 border-amber-400" : "border border-gray-300"}
      `}
    >
      {/* Linha Data + Status */}
      <div className="flex justify-between items-start mb-2 gap-2">
        <p className="text-[13px] font-medium text-gray-800">
          {dateLabel} • {timeStart}–{timeEnd}
        </p>

        <div className="flex gap-2 items-center shrink-0">
          {/* Ícone de status igual ao da timeline */}
          {StatusIcon && (
            <span className="inline-flex items-center justify-center rounded-full bg-white border border-gray-200 w-7 h-7 shadow-sm">
              <StatusIcon
                className="w-4 h-4"
                style={{ color: statusMeta.color }}
                aria-hidden="true"
              />
            </span>
          )}

          {isUpdated && (
            <span className="text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
              Updated
            </span>
          )}
        </div>
      </div>

      {/* Título */}
      <h3
        id={titleId}
        className="text-[16px] font-semibold text-gray-900 leading-tight mb-2"
      >
        {event.title}
      </h3>

      {/* Sala + bolinha de tipo (mesma cor da timeline) */}
      <div className="flex items-center gap-2 text-[14px] text-gray-700 mb-3">
        <span
          className="inline-block w-3 h-3 rounded-full"
          style={{ backgroundColor: typeColor }}
          aria-hidden="true"
        />
        <span className="font-medium">
          {event.roomName || event.room}
        </span>
      </div>

      {/* TAGS (security + options) */}
      <div className="mt-auto flex flex-wrap gap-2">
        {event.security && (
          <span
            className={`text-[12px] px-2 py-1 rounded font-medium ${
              isRestricted
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {isRestricted ? "Restricted" : "Open"}
          </span>
        )}

        {safeOptions.map((opt, idx) => (
          <span
            key={idx}
            className="text-[12px] px-2 py-1 rounded bg-blue-100 text-blue-700 capitalize"
          >
            {opt}
          </span>
        ))}
      </div>

      {/* dica só pra leitor de tela */}
      <span id={srHintId} className="sr-only">
        Press Enter or Space to view full meeting details.
      </span>
    </article>
  );
}
