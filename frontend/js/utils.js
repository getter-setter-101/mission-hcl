// =============================================
// UTILITY FUNCTIONS
// =============================================

// Format a date string (YYYY-MM-DD) to readable format
function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// BUG FIX: Check if a slot has expired using FULL date + time comparison.
// Previous version only compared the time portion, which incorrectly
// marked future-date slots as expired when the time was earlier than
// the current time (e.g., 9:00 AM tomorrow marked expired at 10:00 AM today).
function isSlotPast(slot) {
  const now = new Date();
  const [hours, minutes] = slot.startTime.split(":").map(Number);
  // Construct the full date+time of the slot
  const slotDateTime = new Date(slot.slotDate + "T00:00:00");
  slotDateTime.setHours(hours, minutes, 0, 0);
  return now > slotDateTime;
}

// =============================================
// TOAST NOTIFICATIONS
// =============================================

let toastTimer = null;

function showToast(message, type) {
  // type: 'error' | 'success' | 'warning'
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast toast-" + type;

  // Clear previous timer
  if (toastTimer) clearTimeout(toastTimer);

  // Auto-hide after 3.5s
  toastTimer = setTimeout(() => {
    toast.className = "toast hidden";
  }, 3500);
}
