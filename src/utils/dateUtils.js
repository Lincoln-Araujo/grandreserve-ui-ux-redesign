// src/utils/dateUtils.js
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function formatDateLabel(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d} ${MONTHS_SHORT[Number(m) - 1]} ${y}`;
}

export function formatDateRangeLabel(start, end) {
  if (!start && !end) return "";
  if (start === end) return formatDateLabel(start);
  if (!start) return `until ${formatDateLabel(end)}`;
  if (!end) return `from ${formatDateLabel(start)}`;
  return `${formatDateLabel(start)} – ${formatDateLabel(end)}`;
}
