// Restaurant business rules in one place: opening hours, day off, tables and seating length.
// Every component and util reads from here, so changing a rule is a one-line edit.

export const RESTAURANT = {
  firstSeating: "12:00",
  lastSeating: "22:00",
  slotStepMinutes: 30,
  // JS weekday index: 0 = Sunday, 1 = Monday
  closedWeekday: 1,
  // How long a table stays occupied after the booked time
  seatingMinutes: 120,
  minGuests: 1,
  maxGuests: 10,
  // Table inventory: a booking takes the smallest free table that fits the party
  tables: [
    { seats: 2, count: 4 },
    { seats: 4, count: 5 },
    { seats: 6, count: 2 },
    { seats: 10, count: 1 },
  ],
};
