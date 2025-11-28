export function normalizeScheduleEvent(ev) {
  const safeString = (value, fallback = "") =>
    typeof value === "string" ? value.trim() : fallback;

  const safeLower = (value, fallback = "") =>
    typeof value === "string" ? value.trim().toLowerCase() : fallback;

  const pad = (n) => String(n).padStart(2, "0");

  // Datas
  const start = new Date(ev.start);
  const end = new Date(ev.end);

  const date = ev.start?.split("T")?.[0] || "";

  // Horários humanos
  const start_local = `${pad(start.getHours())}:${pad(start.getMinutes())}`;
  const end_local = `${pad(end.getHours())}:${pad(end.getMinutes())}`;

  return {
    ...ev,

    title: safeString(ev.title, "Untitled event"),
    roomName: safeString(ev.roomName, "Unknown room"),
    status: safeLower(ev.status, "unknown"),
    type: safeLower(ev.type, "other"),
    security: safeLower(ev.security, "open"),
    roomId: safeLower(ev.roomId, "unknown"),

    date,
    start_local,
    end_local,

    options: typeof ev.options === "object" && ev.options !== null ? ev.options : {},

    updated: Boolean(ev.updated),
  };
}
