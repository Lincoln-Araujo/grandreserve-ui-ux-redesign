// src/data/statusConfig.js
import {
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
  } from "@heroicons/react/24/solid";
  
  export const statusConfig = {
    confirmed: {
      label: "Confirmed",
      icon: CheckCircleIcon,
      color: "#16A34A", // verde
    },
    pending: {
      label: "Pending",
      icon: ClockIcon,
      color: "#F59E0B", // amarelo
    },
    tbc: {
      label: "to be confirmed",
      icon: ExclamationTriangleIcon,
      color: "#FB923C", // laranja
    },
    blocked: {
      label: "Blocked",
      icon: XCircleIcon,
      color: "#EF4444", // vermelho
    },
  };
  