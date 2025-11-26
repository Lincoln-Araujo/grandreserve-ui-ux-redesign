import {
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle
} from "lucide-react";

export const statusConfig = {
  confirmed: {
    label: "Confirmed",
    color: "#1E8F4B",
    icon: <CheckCircle size={14} strokeWidth={2} />
  },
  pending: {
    label: "Pending",
    color: "#D97706",
    icon: <Clock size={14} strokeWidth={2} />
  },
  cancelled: {
    label: "Cancelled",
    color: "#B91C1C",
    icon: <XCircle size={14} strokeWidth={2} />
  },
  tentative: {
    label: "Tentative",
    color: "#2563EB",
    icon: <AlertTriangle size={14} strokeWidth={2} />
  }
};
