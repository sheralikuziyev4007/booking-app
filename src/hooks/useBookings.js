import { useState, useEffect, useCallback } from "react";
import { genBookingNumber } from "../utils/dateHelpers";
import { findFreeTable } from "../utils/tables";

const STORAGE_KEY = "atlas-restaurant-bookings";

// Bookings CRUD on top of localStorage + table availability queries
export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      // Guard against corrupted data: an array is expected
      setBookings(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      console.error("Failed to load bookings from localStorage", e);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = useCallback((list) => {
    setBookings(list);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Failed to save bookings to localStorage", e);
    }
  }, []);

  const addBooking = useCallback(
    ({ date, time, tableSize, name, phone, email, guests, comment }) => {
      const booking = {
        id: `${Date.now()}`,
        number: genBookingNumber(),
        date,
        time,
        tableSize,
        name,
        phone,
        email,
        guests,
        comment,
        status: "active",
        createdAt: new Date().toISOString(),
      };
      persist([...bookings, booking]);
      return booking;
    },
    [bookings, persist]
  );

  const cancelBooking = useCallback(
    (id) => {
      persist(bookings.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
    },
    [bookings, persist]
  );

  // Seat count of the table that would be assigned, or null if the slot is full for this party
  const findTable = useCallback((date, time, guests) => findFreeTable(bookings, date, time, guests), [bookings]);

  return { bookings, loading, addBooking, cancelBooking, findTable };
}
