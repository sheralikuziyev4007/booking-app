const WEEKDAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const en = {
  code: "en",
  label: "EN",
  name: "English",
  months: MONTHS,
  // Calendar week starts on Monday
  weekdaysShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

  // "Thursday, September 24"
  formatDate: (y, m, d, weekday) => `${WEEKDAYS_LONG[weekday]}, ${MONTHS[m]} ${d}`,

  // "18:30" → "6:30 PM"
  formatTime: (time) => {
    const [h, min] = time.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(min).padStart(2, "0")} ${suffix}`;
  },

  plurals: {
    guests: { one: "guest", other: "guests" },
    hours: { one: "hour", other: "hours" },
  },

  messages: {
    meta: {
      title: "Atlas Restaurant — Table Reservation",
      description: "Book a table at Atlas Restaurant: pick a date, time and party size.",
    },
    brand: {
      kicker: "Restaurant",
      name: "Atlas",
      tagline: "Pick a day and time — your table will be waiting.",
      hours: "Tue–Sun, {from} – {to}",
      dayOff: "Closed on Mondays",
      tables: "Tables for {min}–{max} guests",
    },
    header: {
      title: "Table reservation",
      myBookings: "My bookings",
      language: "Language",
    },
    steps: {
      label: "Booking steps",
      date: "Date",
      time: "Time",
      details: "Details",
      review: "Review",
    },
    calendar: {
      title: "Choose a day",
      hint: "We are closed on Mondays.",
      prevMonth: "Previous month",
      nextMonth: "Next month",
      closed: "Closed on Mondays",
      fullyBooked: "Fully booked",
      dayOver: "No more seatings today",
      past: "This date has passed",
      legendAvailable: "available",
      legendSelected: "selected",
      legendUnavailable: "closed / full",
    },
    time: {
      hint: "Choose party size and seating time",
      partySize: "Party size",
      decrease: "Fewer guests",
      increase: "More guests",
      max: "max {max}",
      lunch: "Lunch",
      dinner: "Dinner",
      noneLeft: "No tables left for this party size on this date. Try another date or a smaller party.",
      seatingNote: "Tables are reserved for {duration}.",
    },
    form: {
      title: "Your details",
      hint: "We need your contacts to confirm the reservation.",
      name: "Name",
      namePlaceholder: "How should we address you?",
      phone: "Phone",
      phonePlaceholder: "+1 212 555 0123",
      phoneHint: "Include the country code",
      email: "Email",
      emailPlaceholder: "name@example.com",
      comment: "Comment (optional)",
      commentPlaceholder: "Seating preferences, allergies, occasion…",
    },
    errors: {
      nameShort: "Enter your name (at least 2 characters).",
      phoneInvalid: "Enter a valid phone number with country code.",
      emailInvalid: "Enter a valid email address.",
      guestsRange: "Party size must be between {min} and {max}.",
      selectDate: "Please choose a date.",
      selectTime: "Please choose a time.",
      slotTaken: "This time is no longer available. Please choose another one.",
    },
    review: {
      title: "Review your booking",
      hint: "Make sure everything is correct before confirming.",
    },
    fields: {
      date: "Date",
      time: "Time",
      name: "Name",
      phone: "Phone",
      email: "Email",
      guests: "Guests",
      table: "Table",
      comment: "Comment",
    },
    table: "for {seats}",
    nav: {
      back: "Back",
      next: "Next",
      confirm: "Confirm booking",
    },
    success: {
      title: "Booking confirmed",
      hint: "We look forward to seeing you",
      number: "Booking number",
      newBooking: "New booking",
    },
    list: {
      title: "My bookings",
      newBooking: "+ New booking",
      emptyTitle: "You have no bookings yet.",
      emptyHint: "Pick a day and time — your booking will appear here.",
      cancel: "Cancel",
      upcoming: "Upcoming",
      past: "Past",
      cancelled: "Cancelled",
    },
    loading: "Loading…",
  },
};

export default en;
