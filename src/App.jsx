import { useState, useCallback } from "react";
import Header from "./components/Header";
import Stepper from "./components/Stepper";
import Calendar from "./components/Calendar";
import TimeSlotGrid from "./components/TimeSlotGrid";
import BookingForm from "./components/BookingForm";
import BookingSummary from "./components/BookingSummary";
import BookingSuccess from "./components/BookingSuccess";
import MyBookingsList from "./components/MyBookingsList";
import StepNavigation from "./components/StepNavigation";
import { useBookings } from "./hooks/useBookings";
import { validateBookingForm } from "./utils/validation";
import { isPastSlot } from "./utils/dateHelpers";

const EMPTY_FORM = { name: "", phone: "", email: "", guests: 2, comment: "" };

export default function App() {
  const { bookings, loading, addBooking, cancelBooking, occupancyMap } = useBookings();

  const [screen, setScreen] = useState("booking"); // booking | mybookings
  const [step, setStep] = useState(1); // 1..4, 5 = успех
  const [month, setMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [stepError, setStepError] = useState("");
  const [lastBooking, setLastBooking] = useState(null);

  const occupiedForSelected = selectedDate ? occupancyMap[selectedDate] || [] : [];

  const resetFlow = useCallback(() => {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData(EMPTY_FORM);
    setErrors({});
    setStepError("");
    setLastBooking(null);
    setScreen("booking");
  }, []);

  function goNext() {
    setStepError("");
    if (step === 1 && !selectedDate) {
      setStepError("Пожалуйста, выберите дату.");
      return;
    }
    if (step === 2 && !selectedTime) {
      setStepError("Пожалуйста, выберите время.");
      return;
    }
    if (step === 3) {
      const errs = validateBookingForm(formData);
      setErrors(errs);
      if (Object.keys(errs).length) return;
    }
    setStep((s) => s + 1);
  }

  function goBack() {
    setStepError("");
    setStep((s) => Math.max(1, s - 1));
  }

  function confirmBooking() {
    // Пока пользователь заполнял форму, слот мог стать прошедшим или занятым (например, в другой вкладке)
    if (isPastSlot(selectedDate, selectedTime) || occupiedForSelected.includes(selectedTime)) {
      setSelectedTime(null);
      setStep(2);
      setStepError("Это время уже недоступно. Пожалуйста, выберите другое.");
      return;
    }
    const booking = addBooking({
      date: selectedDate,
      time: selectedTime,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      guests: formData.guests,
      comment: formData.comment.trim(),
    });
    setLastBooking(booking);
    setStep(5);
  }

  const canProceedDisabled = (step === 1 && !selectedDate) || (step === 2 && !selectedTime);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center py-10 px-4">
      <div className="bg-bg w-full max-w-[560px] rounded-2xl px-7 pt-7 pb-8 text-ink font-body">
        <Header
          showBookingsButton={screen === "booking" && step < 5}
          onOpenBookings={() => setScreen("mybookings")}
        />

        {loading ? (
          <p className="text-[13px] text-muted">Загрузка…</p>
        ) : screen === "mybookings" ? (
          <MyBookingsList bookings={bookings} onCancel={cancelBooking} onNewBooking={resetFlow} />
        ) : (
          <>
            {step < 5 && <Stepper step={step} />}

            <div className="min-h-[260px]">
              {step === 1 && (
                <Calendar
                  month={month}
                  onMonthChange={setMonth}
                  selectedDate={selectedDate}
                  onSelect={(k) => {
                    setSelectedDate(k);
                    setSelectedTime(null);
                    setStepError("");
                  }}
                  occupancyMap={occupancyMap}
                />
              )}
              {step === 2 && (
                <TimeSlotGrid
                  date={selectedDate}
                  selectedTime={selectedTime}
                  occupied={occupiedForSelected}
                  onSelect={(t) => {
                    setSelectedTime(t);
                    setStepError("");
                  }}
                />
              )}
              {step === 3 && <BookingForm formData={formData} setFormData={setFormData} errors={errors} />}
              {step === 4 && <BookingSummary date={selectedDate} time={selectedTime} formData={formData} />}
              {step === 5 && lastBooking && (
                <BookingSuccess
                  booking={lastBooking}
                  onGoToBookings={() => setScreen("mybookings")}
                  onNewBooking={resetFlow}
                />
              )}
            </div>

            {stepError && <p className="text-danger text-xs mt-3">{stepError}</p>}

            {step < 5 && (
              <StepNavigation
                step={step}
                nextDisabled={canProceedDisabled}
                onBack={goBack}
                onNext={goNext}
                onConfirm={confirmBooking}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
