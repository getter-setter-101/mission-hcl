// =============================================
// APP STATE
// =============================================

const state = {
  user: null,
  currentScreen: "screen-auth",
  screenHistory: [],
  selectedMode: null,
  selectedSpecialty: null,
  selectedDoctor: null,
  selectedSlot: null,
};

// =============================================
// SCREEN NAVIGATION
// =============================================

function showScreen(screenId) {
  // Push current to history before navigating
  if (state.currentScreen && state.currentScreen !== screenId) {
    state.screenHistory.push(state.currentScreen);
  }

  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
  state.currentScreen = screenId;

  // Show/hide nav
  const nav = document.getElementById("top-nav");
  const backBtn = document.getElementById("nav-back-btn");

  if (screenId === "screen-auth") {
    nav.classList.add("hidden");
  } else {
    nav.classList.remove("hidden");
  }

  // Hide back button on mode screen (first screen after login) and success screen
  if (screenId === "screen-mode" || screenId === "screen-success") {
    backBtn.classList.add("hidden");
  } else {
    backBtn.classList.remove("hidden");
  }

  window.scrollTo(0, 0);
}

function goBack() {
  if (state.screenHistory.length > 0) {
    const prev = state.screenHistory.pop();
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    document.getElementById(prev).classList.add("active");
    state.currentScreen = prev;

    // Update nav visibility
    const backBtn = document.getElementById("nav-back-btn");
    if (prev === "screen-mode" || prev === "screen-success") {
      backBtn.classList.add("hidden");
    } else {
      backBtn.classList.remove("hidden");
    }

    window.scrollTo(0, 0);
  }
}

// =============================================
// AUTH
// =============================================

function switchAuthTab(tab) {
  const loginTab = document.getElementById("tab-login");
  const registerTab = document.getElementById("tab-register");
  const loginForm = document.getElementById("form-login");
  const registerForm = document.getElementById("form-register");

  if (tab === "login") {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
  } else {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  }
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  state.user = { fullName: email.split("@")[0], email: email, userId: 1, role: "Patient" };
  showScreen("screen-mode");
}

function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById("reg-username").value;
  const email = document.getElementById("reg-email").value;
  const phone = document.getElementById("reg-phone").value;
  state.user = { fullName: username, email: email, phone: phone, userId: 1, role: "Patient" };
  showScreen("screen-mode");
}

function logout() {
  state.user = null;
  state.screenHistory = [];
  state.selectedMode = null;
  state.selectedSpecialty = null;
  state.selectedDoctor = null;
  state.selectedSlot = null;
  // Reset forms
  document.getElementById("form-login").reset();
  document.getElementById("form-register").reset();
  showScreen("screen-auth");
}

// =============================================
// STEP 1: MODE SELECTION
// =============================================

function selectMode(mode) {
  state.selectedMode = mode;
  renderSpecialties();
  showScreen("screen-specialty");
}

// =============================================
// STEP 2: SPECIALTY SELECTION
// =============================================

function renderSpecialties() {
  document.getElementById("display-mode-specialty").textContent = state.selectedMode;
  const container = document.getElementById("specialty-list");
  container.innerHTML = "";

  MOCK_SPECIALTIES.forEach((sp) => {
    const div = document.createElement("div");
    div.className = "specialty-item";
    div.textContent = sp.specialtyName;
    div.id = "specialty-" + sp.specialtyId;
    div.onclick = () => selectSpecialty(sp);
    container.appendChild(div);
  });
}

function selectSpecialty(specialty) {
  state.selectedSpecialty = specialty;
  renderDoctors();
  showScreen("screen-doctors");
}

// =============================================
// STEP 3: DOCTOR LIST
// =============================================

function renderDoctors() {
  document.getElementById("display-specialty-doctors").textContent = state.selectedSpecialty.specialtyName;
  document.getElementById("display-mode-doctors").textContent = state.selectedMode;

  const container = document.getElementById("doctor-list");
  const noMsg = document.getElementById("no-doctors");
  container.innerHTML = "";

  // Filter: specialty + mode (Issue #3 — Mode mismatch prevention)
  const filtered = MOCK_DOCTORS.filter(
    (d) => d.specialtyId === state.selectedSpecialty.specialtyId && d.mode === state.selectedMode
  );

  if (filtered.length === 0) {
    noMsg.classList.remove("hidden");
    return;
  }
  noMsg.classList.add("hidden");

  filtered.forEach((doc) => {
    const card = document.createElement("div");
    card.className = "doctor-card";
    card.id = "doctor-" + doc.doctorId;
    card.innerHTML = `
      <div class="doctor-name">Dr. ${doc.doctorName}</div>
      <div class="doctor-info">
        <div class="doctor-detail">Specialty: <span>${state.selectedSpecialty.specialtyName}</span></div>
        <div class="doctor-detail">Experience: <span>${doc.experience} years</span></div>
        <div class="doctor-detail">Mode: <span>${doc.mode}</span></div>
        <div class="doctor-detail">Fees: <span>₹${doc.fees}</span></div>
      </div>
      <button class="btn btn-outline" onclick="selectDoctor(${doc.doctorId})">View Slots</button>
    `;
    container.appendChild(card);
  });
}

// =============================================
// STEP 4: SLOT SELECTION
// =============================================

function selectDoctor(doctorId) {
  state.selectedDoctor = MOCK_DOCTORS.find((d) => d.doctorId === doctorId);
  state.selectedSlot = null;

  document.getElementById("display-doctor-slots").textContent = state.selectedDoctor.doctorName;

  // Default date to today
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("slot-date").value = today;
  document.getElementById("slot-date").min = today; // Issue #7 — prevent past date selection

  loadSlots();
  showScreen("screen-slots");
}

function loadSlots() {
  const dateVal = document.getElementById("slot-date").value;
  if (!dateVal) return;

  const container = document.getElementById("slot-list");
  const noMsg = document.getElementById("no-slots");
  container.innerHTML = "";
  state.selectedSlot = null;

  // Issue #7 — reject past dates
  const today = new Date().toISOString().split("T")[0];
  if (dateVal < today) {
    showToast("Cannot view slots for past dates.", "error");
    noMsg.classList.remove("hidden");
    return;
  }

  const filtered = MOCK_SLOTS.filter(
    (s) => s.doctorId === state.selectedDoctor.doctorId && s.slotDate === dateVal
  );

  if (filtered.length === 0) {
    noMsg.classList.remove("hidden");
    return;
  }
  noMsg.classList.add("hidden");

  filtered.forEach((slot) => {
    // Issue #7 — Check if slot has expired (uses FIXED isSlotPast with full date+time)
    const slotExpired = isSlotPast(slot);

    const div = document.createElement("div");
    if (slot.isBooked) {
      div.className = "slot-item booked";
    } else if (slotExpired) {
      div.className = "slot-item expired";
    } else {
      div.className = "slot-item";
    }
    div.id = "slot-" + slot.slotId;

    let statusHtml;
    if (slot.isBooked) {
      statusHtml = '<span class="slot-status booked">Booked</span>';
    } else if (slotExpired) {
      statusHtml = '<span class="slot-status expired">Expired</span>';
    } else {
      statusHtml = '<span class="slot-status available">Available</span>';
    }

    div.innerHTML = `
      <div class="slot-info">
        <div class="slot-time">${slot.startTime} – ${slot.endTime}</div>
        <div class="slot-date">${formatDate(slot.slotDate)}</div>
      </div>
      ${statusHtml}
    `;
    if (!slot.isBooked && !slotExpired) {
      div.onclick = () => toggleSlot(slot, div);
    }
    container.appendChild(div);
  });

  // Add select button
  const btnDiv = document.createElement("div");
  btnDiv.innerHTML = `<button id="btn-select-slot" class="btn btn-primary btn-full btn-select-slot" disabled onclick="proceedToConfirm()">Select Slot</button>`;
  container.appendChild(btnDiv);
}

function toggleSlot(slot, el) {
  // Deselect all
  document.querySelectorAll(".slot-item.selected").forEach((s) => s.classList.remove("selected"));
  // Select this
  el.classList.add("selected");
  state.selectedSlot = slot;

  // Enable button
  const btn = document.getElementById("btn-select-slot");
  if (btn) btn.disabled = false;
}

function proceedToConfirm() {
  if (!state.selectedSlot) return;

  // Issue #4 — Stale slot data check: re-verify slot is still available
  const freshSlot = MOCK_SLOTS.find((s) => s.slotId === state.selectedSlot.slotId);
  if (!freshSlot || freshSlot.isBooked) {
    showToast("This slot was just booked by another patient. Please select a different slot.", "error");
    loadSlots(); // Refresh the slot list
    return;
  }

  // Issue #7 — Re-check if slot has expired since the page was loaded (FIXED: uses full date+time)
  if (isSlotPast(freshSlot)) {
    showToast("This slot has expired. Please select a future time slot.", "error");
    loadSlots();
    return;
  }

  // Issue #5 — Duplicate booking check: does this patient already have an active appointment with this doctor on this date?
  const duplicate = MOCK_APPOINTMENTS.find(
    (a) =>
      a.userId === state.user.userId &&
      a.doctorId === state.selectedDoctor.doctorId &&
      a.slotDate === state.selectedSlot.slotDate &&
      a.status === "Confirmed"
  );
  if (duplicate) {
    showToast("You already have an active appointment with this doctor on this date.", "warning");
    return;
  }

  renderConfirmation();
  showScreen("screen-confirm");
}

// =============================================
// STEP 5: CONFIRMATION
// =============================================

function renderConfirmation() {
  document.getElementById("confirm-doctor").textContent = "Dr. " + state.selectedDoctor.doctorName;
  document.getElementById("confirm-specialty").textContent = state.selectedSpecialty.specialtyName;
  document.getElementById("confirm-mode").textContent = state.selectedMode;
  document.getElementById("confirm-date").textContent = formatDate(state.selectedSlot.slotDate);
  document.getElementById("confirm-time").textContent = state.selectedSlot.startTime + " – " + state.selectedSlot.endTime;
  document.getElementById("confirm-fees").textContent = "₹" + state.selectedDoctor.fees;
}

function confirmAppointment() {
  // Issue #1 & #4 — Final double-booking & stale data check (simulates transactional lock)
  const slot = MOCK_SLOTS.find((s) => s.slotId === state.selectedSlot.slotId);
  if (!slot || slot.isBooked) {
    showToast("Booking failed: This slot was just booked by another patient.", "error");
    state.screenHistory = state.screenHistory.filter((s) => s !== "screen-confirm");
    loadSlots();
    showScreen("screen-slots");
    return;
  }

  // Issue #7 — Final expiry check (FIXED: uses full date+time)
  if (isSlotPast(slot)) {
    showToast("Booking failed: This slot has expired.", "error");
    state.screenHistory = state.screenHistory.filter((s) => s !== "screen-confirm");
    loadSlots();
    showScreen("screen-slots");
    return;
  }

  // Issue #5 — Final duplicate check
  const duplicate = MOCK_APPOINTMENTS.find(
    (a) =>
      a.userId === state.user.userId &&
      a.doctorId === state.selectedDoctor.doctorId &&
      a.slotDate === state.selectedSlot.slotDate &&
      a.status === "Confirmed"
  );
  if (duplicate) {
    showToast("Booking failed: You already have an appointment with this doctor on this date.", "warning");
    return;
  }

  // Issue #3 — Mode mismatch final validation
  if (state.selectedDoctor.mode !== state.selectedMode) {
    showToast("Booking failed: This doctor is not available for " + state.selectedMode + " consultations.", "error");
    return;
  }

  // === ALL CHECKS PASSED — BOOK THE APPOINTMENT ===

  // Mark slot as booked (Issue #1 — slot locking)
  slot.isBooked = true;

  // Create appointment record
  const specialty = MOCK_SPECIALTIES.find((s) => s.specialtyId === state.selectedDoctor.specialtyId);
  const meetingLink = state.selectedMode === "Online" ? "https://meet.clinic.com/apt-" + Date.now() : null;
  const clinicAddress =
    state.selectedMode === "Offline"
      ? MOCK_CLINIC_ADDRESSES[state.selectedDoctor.doctorId] || "Main Clinic, Ground Floor, City Hospital"
      : null;

  const appointment = {
    appointmentId: appointmentIdCounter++,
    userId: state.user.userId,
    doctorId: state.selectedDoctor.doctorId,
    doctorName: state.selectedDoctor.doctorName,
    specialtyName: specialty ? specialty.specialtyName : "",
    slotId: state.selectedSlot.slotId,
    slotDate: state.selectedSlot.slotDate,
    startTime: state.selectedSlot.startTime,
    endTime: state.selectedSlot.endTime,
    mode: state.selectedMode,
    status: "Confirmed",
    bookingDate: new Date().toISOString(),
    meetingLink: meetingLink,
    clinicAddress: clinicAddress,
    fees: state.selectedDoctor.fees,
  };

  MOCK_APPOINTMENTS.push(appointment);

  renderSuccess(appointment);
  showScreen("screen-success");

  // Clear history so user can't go back to confirm again
  state.screenHistory = [];
}

// =============================================
// STEP 6: SUCCESS
// =============================================

function renderSuccess(appointment) {
  document.getElementById("success-doctor").textContent = "Dr. " + appointment.doctorName;
  document.getElementById("success-datetime").textContent =
    formatDate(appointment.slotDate) + ", " + appointment.startTime + " – " + appointment.endTime;
  document.getElementById("success-mode").textContent = appointment.mode;

  const onlineInfo = document.getElementById("success-online-info");
  const offlineInfo = document.getElementById("success-offline-info");

  if (appointment.mode === "Online") {
    onlineInfo.classList.remove("hidden");
    offlineInfo.classList.add("hidden");
    const linkEl = document.getElementById("success-link");
    linkEl.textContent = appointment.meetingLink;
    linkEl.href = appointment.meetingLink;
  } else {
    offlineInfo.classList.remove("hidden");
    onlineInfo.classList.add("hidden");
    document.getElementById("success-address").textContent = appointment.clinicAddress;
  }
}

function bookAnother() {
  state.selectedMode = null;
  state.selectedSpecialty = null;
  state.selectedDoctor = null;
  state.selectedSlot = null;
  state.screenHistory = [];
  showScreen("screen-mode");
}

// =============================================
// UC-4: MY APPOINTMENTS
// =============================================

function showMyAppointments() {
  renderMyAppointments();
  showScreen("screen-my-appointments");
}

function renderMyAppointments() {
  const container = document.getElementById("my-appointments-list");
  const noMsg = document.getElementById("no-appointments");
  container.innerHTML = "";

  // Filter appointments for current user
  const userAppointments = MOCK_APPOINTMENTS.filter((a) => a.userId === state.user.userId);

  if (userAppointments.length === 0) {
    noMsg.classList.remove("hidden");
    return;
  }
  noMsg.classList.add("hidden");

  // Sort by booking date descending (newest first)
  userAppointments.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

  userAppointments.forEach((apt) => {
    const card = document.createElement("div");
    card.className = "appointment-card";
    card.id = "appointment-" + apt.appointmentId;

    const statusClass = "badge-" + apt.status.toLowerCase();
    const canCancel = apt.status === "Confirmed";
    const canComplete = apt.status === "Confirmed";

    let modeDetail = "";
    if (apt.mode === "Online" && apt.meetingLink) {
      modeDetail = `<div class="appointment-detail">Meeting Link: <a href="${apt.meetingLink}" target="_blank" class="link">${apt.meetingLink}</a></div>`;
    } else if (apt.mode === "Offline" && apt.clinicAddress) {
      modeDetail = `<div class="appointment-detail">Clinic: <span>${apt.clinicAddress}</span></div>`;
    }

    let actionsHtml = "";
    if (canCancel || canComplete) {
      actionsHtml = '<div class="appointment-actions">';
      if (canCancel) {
        actionsHtml += `<button class="btn btn-danger-outline btn-sm" onclick="cancelAppointment(${apt.appointmentId})">Cancel</button>`;
      }
      if (canComplete) {
        actionsHtml += `<button class="btn btn-outline btn-sm" onclick="updateAppointmentStatus(${apt.appointmentId}, 'Completed')">Mark Completed</button>`;
        actionsHtml += `<button class="btn btn-outline btn-sm" onclick="updateAppointmentStatus(${apt.appointmentId}, 'NoShow')">No Show</button>`;
      }
      actionsHtml += "</div>";
    }

    card.innerHTML = `
      <div class="appointment-header">
        <span class="appointment-doctor">Dr. ${apt.doctorName}</span>
        <span class="appointment-status-badge ${statusClass}">${apt.status}</span>
      </div>
      <div class="appointment-details">
        <div class="appointment-detail">Specialty: <span>${apt.specialtyName}</span></div>
        <div class="appointment-detail">Date: <span>${formatDate(apt.slotDate)}</span></div>
        <div class="appointment-detail">Time: <span>${apt.startTime} – ${apt.endTime}</span></div>
        <div class="appointment-detail">Mode: <span>${apt.mode}</span></div>
        <div class="appointment-detail">Fees: <span>₹${apt.fees}</span></div>
        ${modeDetail}
      </div>
      ${actionsHtml}
    `;
    container.appendChild(card);
  });
}

// =============================================
// UC-6: CANCEL APPOINTMENT
// =============================================

function cancelAppointment(appointmentId) {
  const apt = MOCK_APPOINTMENTS.find((a) => a.appointmentId === appointmentId);
  if (!apt) {
    showToast("Appointment not found.", "error");
    return;
  }

  // Issue #8 — Validate status transition
  if (!VALID_TRANSITIONS[apt.status] || !VALID_TRANSITIONS[apt.status].includes("Cancelled")) {
    showToast("Cannot cancel: appointment is already " + apt.status + ".", "error");
    return;
  }

  // Issue #6 — Cancel appointment AND release slot in a single "transaction"
  // Step 1: Update appointment status
  apt.status = "Cancelled";

  // Step 2: Release the slot (set IsBooked = false)
  const slot = MOCK_SLOTS.find((s) => s.slotId === apt.slotId);
  if (slot) {
    slot.isBooked = false;
  }

  showToast("Appointment cancelled. Slot has been released.", "success");
  renderMyAppointments(); // Refresh the list
}

// =============================================
// UC-5: UPDATE APPOINTMENT STATUS
// =============================================

function updateAppointmentStatus(appointmentId, newStatus) {
  const apt = MOCK_APPOINTMENTS.find((a) => a.appointmentId === appointmentId);
  if (!apt) {
    showToast("Appointment not found.", "error");
    return;
  }

  // Issue #8 — Validate status transition
  const allowedTransitions = VALID_TRANSITIONS[apt.status];
  if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
    showToast(
      "Invalid transition: cannot change from " + apt.status + " to " + newStatus + ".",
      "error"
    );
    return;
  }

  apt.status = newStatus;
  showToast("Appointment status updated to " + newStatus + ".", "success");
  renderMyAppointments(); // Refresh the list
}
