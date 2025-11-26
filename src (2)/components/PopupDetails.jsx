// src/components/PopupDetails.jsx
import { typeColors } from "../data/typeColors";
import { statusConfig } from "../data/statusConfig";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function PopupDetails({ event, onClose }) {
  if (!event) return null;

  const statusMeta = statusConfig[event.status] || statusConfig.confirmed;
  const StatusIcon = statusMeta.icon;

  const formatDateTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBackdropClick = () => {
    onClose && onClose();
  };

  const stop = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-black/40 transition-opacity duration-700 ease-in-out"
      aria-modal="true"
      role="dialog"
      onClick={handleBackdropClick}
    >
      <aside
        className="bg-white w-full max-w-md h-full shadow-xl border-l border-gray-200 p-6 overflow-y-auto transform translate-x-0 transition-transform duration-700 ease-in-out"
        onClick={stop}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <XMarkIcon className="w-6 h-6" aria-hidden="true" />
          <span className="sr-only">Close details</span>
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 pr-10 mb-2">
          {event.title}
        </h2>
        <p className="text-sm text-gray-600 mb-6">{event.roomName}</p>

        <div className="space-y-4 text-sm text-gray-800">
          {/* Type */}
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: typeColors[event.type] || typeColors.other }}
            />
            <span className="capitalize font-medium">{event.type}</span>
          </div>

          {/* Date / time */}
          <div>
            <p className="font-semibold text-gray-700">Start</p>
            <p>{formatDateTime(event.start)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">End</p>
            <p>{formatDateTime(event.end)}</p>
          </div>

          {/* Security */}
          <div>
            <p className="font-semibold text-gray-700">Security</p>
            <p className="capitalize">{event.security}</p>
          </div>

          {/* Options */}
          <div>
            <p className="font-semibold text-gray-700">Options</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Record: {event.options?.record ? "Yes" : "No"}</li>
              <li>Webcast: {event.options?.webcast ? "Yes" : "No"}</li>
              <li>Archive: {event.options?.archive ? "Yes" : "No"}</li>
            </ul>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 pt-2">
            <span className="inline-flex items-center justify-center bg-white border border-gray-300 rounded-full p-2 shadow-sm">
              <StatusIcon
                className="w-5 h-5"
                style={{ color: statusMeta.color }}
                aria-hidden="true"
              />
            </span>
            <span className="capitalize font-medium">{statusMeta.label}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
