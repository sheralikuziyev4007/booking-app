import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import BrandPanel from "./components/BrandPanel";
import Header from "./components/Header";
import Stepper from "./components/Stepper";
import Calendar from "./components/Calendar";
import TimeSlotGrid from "./components/TimeSlotGrid";
import BookingSummary from "./components/BookingSummary";
import BookingSuccess from "./components/BookingSuccess";
import MyBookingsList from "./components/MyBookingsList";
import StepNavigation from "./components/StepNavigation";
import StepTransition from "./components/ui/StepTransition";
import Icon from "./components/ui/Icon";
import { useBookings } from "./hooks/useBookings";
import { useI18n } from "./i18n/I18nProvider";
import { isPastSlot } from "./utils/dateHelpers";

// The contact form and its validation pull in phone-number metadata (~40 kB gzip),
// so they are split into a separate chunk and preloaded once the user reaches step 2.
const loadBookingForm = () => import("./components/BookingForm");
const loadValidation = () => import("./utils/validation");
const BookingForm = lazy(loadBookingForm);

const EMPTY_FORM = { name: "", phone: "", email: "", guests: 2, comment: "" };

export default function App() {
  const { t } = useI18n();
  const { bookings, loading, addBooking, cancelBooking, findTable } = useBookings();

  const [screen, setScreen] = useState("booking"); // booking | mybookings
  const [step, setStep] = useState(1); // 1..4, 5 = success
  const [month, setMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  // Translation key, so the message switches language together with the UI
  const [stepError, setStepError] = useState("");
  const [lastBooking, setLastBooking] = useState(null);

  const tableSize = selectedDate && selectedTime ? findTable(selectedDate, selectedTime, formData.guests) : null;

  useEffect(() => {
    if (step >= 2) {
      loadBookingForm();
      loadValidation();
    }
  }, [step]);

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

  function changeGuests(guests) {
    setFormData((f) => ({ ...f, guests }));
    // A bigger party may not fit at the chosen time any more
    if (selectedTime && findTable(selectedDate, selectedTime, guests) === null) setSelectedTime(null);
  }

  async function goNext() {
    setStepError("");
    if (step === 1 && !selectedDate) {
      setStepError("errors.selectDate");
      return;
    }
    if (step === 2 && !selectedTime) {
      setStepError("errors.selectTime");
      return;
    }
    if (step === 3) {
      const { validateBookingForm } = await loadValidation();
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
    // While the form was being filled the slot may have passed or been taken (e.g. in another tab)
    if (isPastSlot(selectedDate, selectedTime) || tableSize === null) {
      setSelectedTime(null);
      setStep(2);
      setStepError("errors.slotTaken");
      return;
    }
    const booking = addBooking({
      date: selectedDate,
      time: selectedTime,
      tableSize,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      guests: formData.guests,
      comment: formData.comment.trim(),
    });
    setLastBooking(booking);
    setStep(5);
  }

  const nextDisabled = (step === 1 && !selectedDate) || (step === 2 && !selectedTime);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg font-body text-ink lg:grid lg:grid-cols-[5fr_7fr]">
      <BrandPanel />

      <main className="flex min-h-0 flex-1 justify-center overflow-y-auto bg-bg px-5 py-3 sm:px-10 lg:px-14 lg:py-5">
        <div className="my-auto w-full max-w-[580px]">
          <Header
            showBookingsButton={screen === "booking" && step < 5}
            onOpenBookings={() => setScreen("mybookings")}
          />

          {loading ? (
            <p className="text-sm text-muted">{t("loading")}</p>
          ) : screen === "mybookings" ? (
            <MyBookingsList bookings={bookings} onCancel={cancelBooking} onNewBooking={resetFlow} />
          ) : (
            <>
              {step < 5 && <Stepper step={step} />}

              <StepTransition stepKey={step}>
                <div>
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
                      findTable={findTable}
                    />
                  )}
                  {step === 2 && (
                    <TimeSlotGrid
                      date={selectedDate}
                      guests={formData.guests}
                      onGuestsChange={changeGuests}
                      selectedTime={selectedTime}
                      findTable={findTable}
                      onSelect={(time) => {
                        setSelectedTime(time);
                        setStepError("");
                      }}
                    />
                  )}
                  {step === 3 && (
                    <Suspense fallback={<p className="text-sm text-muted">{t("loading")}</p>}>
                      <BookingForm
                        formData={formData}
                        setFormData={setFormData}
                        errors={errors}
                        onClearError={(field) => setErrors(({ [field]: _removed, ...rest }) => rest)}
                      />
                    </Suspense>
                  )}
                  {step === 4 && (
                    <BookingSummary date={selectedDate} time={selectedTime} tableSize={tableSize} formData={formData} />
                  )}
                  {step === 5 && lastBooking && (
                    <BookingSuccess
                      booking={lastBooking}
                      onGoToBookings={() => setScreen("mybookings")}
                      onNewBooking={resetFlow}
                    />
                  )}
                </div>
              </StepTransition>

              {stepError && (
                <p role="alert" className="mt-2 flex items-start gap-2 text-sm text-danger">
                  <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
                  <span>{t(stepError)}</span>
                </p>
              )}

              {step < 5 && (
                <StepNavigation
                  step={step}
                  nextDisabled={nextDisabled}
                  onBack={goBack}
                  onNext={goNext}
                  onConfirm={confirmBooking}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
