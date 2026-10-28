import { useState, useCallback, useEffect, useRef, lazy, Suspense } from "react";
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
import { useHistoryNav } from "./hooks/useHistoryNav";
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

  // Latest values for the history handler, which runs outside React's render cycle
  const latest = useRef({});
  latest.current = { selectedDate, selectedTime, formData, lastBooking };
  // Error to show after a programmatic jump back (set before history.go, read on popstate)
  const pendingError = useRef("");

  const clearFlow = useCallback(() => {
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData(EMPTY_FORM);
    setErrors({});
    setStepError("");
    setLastBooking(null);
  }, []);

  // Where a browser Back/Forward press may land, given what the user has filled in so far.
  // State changes go into `arrive`, so they are applied together with the step change.
  const resolveHistory = useCallback(
    async (target) => {
      const { selectedDate, selectedTime, formData, lastBooking } = latest.current;
      const error = pendingError.current;
      pendingError.current = "";
      const arrive = () => {
        setStepError(error);
        if (error === "errors.slotTaken") setSelectedTime(null);
      };

      if (target.screen === "mybookings") return { ...target, arrive };
      if (lastBooking) {
        if (target.step === 5) return { ...target, arrive };
        // Leaving the confirmation backwards: the booking is done, start a fresh one
        return { screen: "booking", step: 1, arrive: clearFlow };
      }

      const maxStep = !selectedDate ? 1 : !selectedTime ? 2 : 4;
      let step = Math.min(target.step, maxStep);
      let errs = {};
      if (step === 4) {
        const { validateBookingForm } = await loadValidation();
        errs = validateBookingForm(formData);
        if (Object.keys(errs).length) step = 3;
      }
      return {
        screen: "booking",
        step,
        arrive: () => {
          arrive();
          if (Object.keys(errs).length) setErrors(errs);
        },
      };
    },
    [clearFlow]
  );

  const { nav, navigate, back } = useHistoryNav(resolveHistory);
  const { screen, step } = nav;

  const tableSize = selectedDate && selectedTime ? findTable(selectedDate, selectedTime, formData.guests) : null;

  useEffect(() => {
    if (step >= 2) {
      loadBookingForm();
      loadValidation();
    }
  }, [step]);

  const resetFlow = useCallback(() => {
    clearFlow();
    navigate({ screen: "booking", step: 1 });
  }, [clearFlow, navigate]);

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
    navigate({ step: step + 1 });
  }

  function goBack() {
    setStepError("");
    back();
  }

  function confirmBooking() {
    // While the form was being filled the slot may have passed or been taken (e.g. in another tab)
    if (isPastSlot(selectedDate, selectedTime) || tableSize === null) {
      // Jump back through the history entries of steps 3 and 4 to the time step;
      // the stale time is cleared there (the review step still needs it until then)
      pendingError.current = "errors.slotTaken";
      window.history.go(-2);
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
    navigate({ step: 5 });
  }

  const nextDisabled = (step === 1 && !selectedDate) || (step === 2 && !selectedTime);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg font-body text-ink lg:grid lg:grid-cols-[5fr_7fr]">
      <BrandPanel />

      <main className="flex min-h-0 flex-1 justify-center overflow-y-auto bg-bg px-5 py-3 sm:px-10 lg:px-14 lg:py-5">
        <div className="my-auto w-full max-w-[580px]">
          <Header
            showBookingsButton={screen === "booking" && step < 5}
            onOpenBookings={() => navigate({ screen: "mybookings" })}
          />

          {loading ? (
            <p className="text-sm text-muted">{t("loading")}</p>
          ) : screen === "mybookings" ? (
            <MyBookingsList bookings={bookings} onCancel={cancelBooking} onNewBooking={resetFlow} onBack={back} />
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
                      onGoToBookings={() => navigate({ screen: "mybookings" })}
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
