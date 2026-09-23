import { useState, useEffect, useMemo, useCallback } from "react";
import { genBookingNumber } from "../utils/dateHelpers";

const STORAGE_KEY = "atlas-restaurant-bookings";

// CRUD-логика броней поверх localStorage
export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      // Защита от повреждённых данных: ожидаем массив
      setBookings(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      console.error("Не удалось загрузить брони из localStorage", e);
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
      console.error("Не удалось сохранить брони в localStorage", e);
    }
  }, []);

  const addBooking = useCallback(
    ({ date, time, name, phone, email, guests, comment }) => {
      const booking = {
        id: `${Date.now()}`,
        number: genBookingNumber(),
        date,
        time,
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

  // Карта занятых слотов по датам: { "2026-08-20": ["12:00", "12:30"] }
  const occupancyMap = useMemo(() => {
    const map = {};
    bookings.forEach((b) => {
      if (b.status === "cancelled") return;
      if (!map[b.date]) map[b.date] = [];
      map[b.date].push(b.time);
    });
    return map;
  }, [bookings]);

  return { bookings, loading, addBooking, cancelBooking, occupancyMap };
}
