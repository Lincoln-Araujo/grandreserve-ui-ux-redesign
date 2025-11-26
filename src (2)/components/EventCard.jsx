import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function EventCard({ event, onOpenDetails }) {
  const isUpdated = event.updated === true;

  // Cores do tipo de evento
  const typeColors = {
    plenary: "#0055A4",
    press: "#B45309",
    side: "#047857",
    other: "#374151",
  };

  const typeColor = typeColors[event.type] || "#374151";

  // Ícones de status
  const statusIcons = {
    confirmed: <CheckCircleIcon className="h-5 w-5 text-green-600" />,
    pending: <ClockIcon className="h-5 w-5 text-amber-600" />,
    tbc: <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />,
    blocked: <XCircleIcon className="h-5 w-5 text-red-600" />,
  };

  return (
    <div
      className={`
        border rounded-lg p-4 flex flex-col shadow-sm hover:shadow-md transition
        bg-white cursor-pointer relative
        ${isUpdated ? "border-2 border-amber-400" : "border border-gray-300"}
        h-full
      `}
      onClick={() => onOpenDetails(event)}
    >
      {/* Linha Data/Hora + Updated + Ícone de Status */}
      <div className="flex justify-between items-start mb-2">
        <p className="text-[14px] font-medium text-gray-800">
          {event.date} • {event.start}–{event.end}
        </p>

        <div className="flex gap-2 items-center">
          {statusIcons[event.status]}

          {isUpdated && (
            <span className="text-[12px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
              Updated
            </span>
          )}
        </div>
      </div>

      {/* Título */}
      <h3 className="text-[16px] font-semibold text-gray-900 leading-tight mb-2">
        {event.title}
      </h3>

      {/* Sala + bolinha de type */}
      <div className="flex items-center gap-2 text-[14px] text-gray-700 mb-2">
        <span
          className="inline-block w-3 h-3 rounded-full"
          style={{ backgroundColor: typeColor }}
        ></span>
        <span className="font-medium">{event.room}</span>
      </div>

      {/* Tags opções / security */}
      <div className="flex flex-wrap gap-2 mt-1">
        {event.security && (
          <span className="text-[12px] px-2 py-1 rounded bg-red-100 text-red-700">
            {event.security}
          </span>
        )}

        {event.options &&
          event.options.map((opt, idx) => (
            <span
              key={idx}
              className="text-[12px] px-2 py-1 rounded bg-blue-100 text-blue-700"
            >
              {opt}
            </span>
          ))}
      </div>

      {/* “Details” ocupando 100% da largura */}
      <button
        className="
          mt-auto 
          bg-gray-100 hover:bg-gray-200 
          w-full text-center py-2 
          text-[14px] font-medium text-gray-700
          rounded-b-md
        "
        onClick={(e) => {
          e.stopPropagation();
          onOpenDetails(event);
        }}
      >
        Details →
      </button>
    </div>
  );
}
