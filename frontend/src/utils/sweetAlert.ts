import Swal from "sweetalert2";

const AUTH_ERROR_MESSAGES = [
  "token expired",
  "invalid token",
  "authorization token missing",
  "jwt expired",
  "unauthorized",
];

const isAuthSessionError = (message: string) => {
  const normalizedMessage = (message || "").toLowerCase();
  return AUTH_ERROR_MESSAGES.some((item) => normalizedMessage.includes(item));
};

const clearAuthStorage = () => {
  const keys = [
    "token",
    "sessionToken",
    "studentToken",
    "isAdmin",
    "userRole",
    "user",
    "admin",
  ];
  keys.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

const redirectToLogin = () => {
  const isStudentPath = window.location.pathname.startsWith("/student");
  const loginPath = isStudentPath ? "/student/login" : "/admin/login";

  if (!window.location.pathname.includes("/login")) {
    window.location.href = loginPath;
  }
};

// Custom theme colors to match your school branding
const customColors = {
  primary: "#035CB0",
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
};

// Modern toast configuration
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.style.borderRadius = "12px";
    toast.style.padding = "16px";
    toast.style.fontSize = "14px";
    toast.style.boxShadow =
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)";
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
  customClass: {
    popup: "modern-toast",
    title: "modern-toast-title",
  },
});

// Success alert - Modern toast style
export const showSuccess = (message: string) => {
  return Toast.fire({
    icon: "success",
    title: message,
    iconColor: customColors.success,
  });
};

// Error alert - Compact modal for errors (more attention needed)
export const showError = (message: string, title: string = "Error!") => {
  if (isAuthSessionError(message)) {
    clearAuthStorage();
    redirectToLogin();
    return Promise.resolve();
  }

  return Swal.fire({
    icon: "error",
    title,
    text: message,
    confirmButtonColor: customColors.error,
    confirmButtonText: "OK",
    width: "400px",
    padding: "20px",
    customClass: {
      popup: "modern-alert",
      confirmButton: "modern-button",
    },
    buttonsStyling: false,
  });
};

// Warning alert - Compact style
export const showWarning = (message: string, title: string = "Warning!") => {
  return Swal.fire({
    icon: "warning",
    title,
    text: message,
    confirmButtonColor: customColors.warning,
    confirmButtonText: "OK",
    width: "400px",
    padding: "20px",
    customClass: {
      popup: "modern-alert",
      confirmButton: "modern-button",
    },
    buttonsStyling: false,
  });
};

// Info alert - Toast style for non-critical info
export const showInfo = (message: string) => {
  return Toast.fire({
    icon: "info",
    title: message,
    iconColor: customColors.info,
  });
};

// Confirmation dialog - Compact modern style
export const showConfirm = (
  message: string,
  title: string = "Are you sure?",
  confirmButtonText: string = "Yes, proceed!",
  cancelButtonText: string = "Cancel",
) => {
  return Swal.fire({
    title,
    text: message,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: customColors.primary,
    cancelButtonColor: "#6b7280",
    confirmButtonText,
    cancelButtonText,
    width: "450px",
    padding: "20px",
    customClass: {
      popup: "modern-alert",
      confirmButton: "modern-button",
      cancelButton: "modern-button-outline",
    },
    buttonsStyling: false,
    reverseButtons: true,
  });
};

// Delete confirmation - Compact modern style
export const showDeleteConfirm = (
  itemName: string = "this item",
  title: string = "Delete Confirmation",
) => {
  return Swal.fire({
    title,
    text: `Are you sure you want to delete ${itemName}? This action cannot be undone!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: customColors.error,
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    width: "450px",
    padding: "20px",
    customClass: {
      popup: "modern-alert",
      confirmButton: "modern-button-danger",
      cancelButton: "modern-button-outline",
    },
    buttonsStyling: false,
    reverseButtons: true,
  });
};

// Loading alert - Compact modern style
export const showLoading = (message: string = "Please wait...") => {
  Swal.fire({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    width: "350px",
    padding: "20px",
    customClass: {
      popup: "modern-alert",
    },
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// Close loading
export const closeLoading = () => {
  Swal.close();
};

// Toast notification (small, auto-dismiss) - Using the modern Toast config
export const showToast = (
  message: string,
  icon: "success" | "error" | "warning" | "info" = "success",
  position:
    | "top-end"
    | "top"
    | "top-start"
    | "center"
    | "bottom"
    | "bottom-start"
    | "bottom-end" = "top-end",
) => {
  const iconColors: { [key: string]: string } = {
    success: customColors.success,
    error: customColors.error,
    warning: customColors.warning,
    info: customColors.info,
  };

  return Toast.fire({
    icon,
    title: message,
    position,
    iconColor: iconColors[icon],
  });
};

// Custom HTML alert - With modern defaults
export const showCustom = (options: any) => {
  return Swal.fire({
    confirmButtonColor: customColors.primary,
    width: "450px",
    padding: "20px",
    customClass: {
      popup: "modern-alert",
      confirmButton: "modern-button",
      ...options.customClass,
    },
    buttonsStyling: false,
    ...options,
  });
};

export default {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showConfirm,
  showDeleteConfirm,
  showLoading,
  closeLoading,
  showToast,
  showCustom,
};
