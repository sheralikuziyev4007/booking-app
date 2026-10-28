# Atlas Restaurant — Table Reservation

A table reservation web app for a restaurant: a step-by-step date and time picker, real table-capacity rules, international phone validation, booking confirmation, and a "My bookings" list with cancellation. The UI is available in English and Russian.

**Repository:** https://github.com/sheralikuziyev4007/booking-app

<!-- Uncomment after the first GitHub Pages deploy:
**Live demo:** https://sheralikuziyev4007.github.io/booking-app/
-->

![Desktop screenshot](docs/screenshot.png)

<img src="docs/screenshot-mobile.png" alt="Mobile version" width="260" />

## Features

- **Four-step flow:** date → party size & time → contact details → review, then a confirmation "ticket" with a booking number.
- **Table capacity:** the restaurant has a table inventory (2-, 4-, 6- and 10-seat tables). A booking takes the smallest free table that fits the party and holds it for 2 hours. A time slot is disabled only when no table fits for the whole seating, and changing the party size updates the available times instantly.
- **Calendar rules:** past dates, the day off (Monday) and fully booked days are disabled. For today, past slots are hidden, and after the last seating today is disabled.
- **Double-booking guard:** availability is re-checked on confirmation. If the slot has passed or been taken, the user is sent back to choose another time.
- **International phone input:** numbers from any country are formatted as you type (`+1 212 555 0123`, `+998 90 123 45 67`) and validated with [libphonenumber-js](https://gitlab.com/catamphetamine/libphonenumber-js).
- **Localization (EN / RU):** a lightweight i18n layer without extra dependencies. It covers plural rules via `Intl.PluralRules`, 12-hour time in English and 24-hour time in Russian, and localized date formats. The chosen language is saved; the first visit uses the browser language.
- **My bookings:** Upcoming / Past / Cancelled statuses, and cancelling a booking frees its table.
- **Persistence:** data is stored in `localStorage`, so no backend is needed. Corrupted data is handled gracefully.
- **Responsive design:** two columns on desktop (brand panel + form) and a compact banner on mobile.
- **Accessibility:** labels are linked to inputs, errors and hints use `aria-describedby`, there are `aria-pressed` toggle states and a visible keyboard focus, and `prefers-reduced-motion` is respected.
- **Performance:** the contact form and phone metadata are code-split and preloaded only when the user reaches step 2.

## Tech stack

React 18 (hooks, Context, `lazy`/`Suspense`) · Vite · Tailwind CSS · libphonenumber-js · Vitest + Testing Library · GitHub Actions

The Cormorant Garamond and Onest fonts are self-hosted via Fontsource, with no requests to Google Fonts.

## Getting started

Requires Node.js 20.19+ or 22.12+.

```bash
git clone https://github.com/sheralikuziyev4007/booking-app.git
cd booking-app
npm install
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

## Scripts

| Command           | Description                                         |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Start the dev server                                |
| `npm run build`   | Production build into `dist`                        |
| `npm run preview` | Preview the production build locally                |
| `npm test`        | Unit tests and integration tests of the booking flow |

## Configuration

All business rules live in [`src/config/restaurant.js`](src/config/restaurant.js): first and last seating, slot step, day off, seating duration, party size limits and the table inventory. The UI (brand panel facts, calendar, time slots, validation) reads from this file, so changing a rule is a one-line edit.

To add a language, copy `src/i18n/locales/en.js`, translate it and register it in `LOCALES` in `src/i18n/I18nProvider.jsx`. A test checks that every locale has the same keys as English.

## Project structure

```
src/
├── config/
│   └── restaurant.js        // hours, day off, tables, seating length
├── i18n/
│   ├── locales/en.js        // English dictionary + date/time formatting
│   ├── locales/ru.js        // Russian dictionary
│   └── I18nProvider.jsx     // context, useI18n(), t(), plural(), formatDate()
├── components/
│   ├── ui/                  // reusable primitives: Button, Field, Input, Row, Icon, …
│   ├── BrandPanel.jsx       // restaurant name and facts
│   ├── Header.jsx           // title, language switch, "My bookings"
│   ├── LanguageSwitcher.jsx // EN / RU toggle
│   ├── Stepper.jsx          // step indicator
│   ├── Calendar.jsx         // month view with availability
│   ├── DayCell.jsx          // calendar day
│   ├── GuestPicker.jsx      // party size stepper
│   ├── TimeSlotGrid.jsx     // lunch / dinner slots
│   ├── TimeSlotButton.jsx   // single slot
│   ├── BookingForm.jsx      // contact form (lazy-loaded)
│   ├── BookingSummary.jsx   // review step
│   ├── BookingSuccess.jsx   // confirmation ticket
│   ├── StepNavigation.jsx   // Back / Next / Confirm
│   ├── MyBookingsList.jsx   // bookings list
│   └── BookingCard.jsx      // single booking
├── hooks/
│   └── useBookings.js       // bookings CRUD + localStorage + table lookup
├── utils/
│   ├── tables.js            // table assignment and seating overlap
│   ├── dateHelpers.js       // date keys, day off, past slots, booking number
│   ├── generateTimeSlots.js // slot grid
│   ├── formatPhone.js       // international phone formatting/validation
│   └── validation.js        // form validation (returns error codes)
├── App.jsx
├── main.jsx
└── index.css
```

Tests live next to the code: `*.test.js` for utilities and i18n, and `App.test.jsx` for the full booking flow in both languages.

## Deploying to GitHub Pages

The repository includes `.github/workflows/deploy.yml`. On every push to `main` it runs the tests, builds the app and publishes it.

1. Push the project to GitHub (branch `main`).
2. Open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. When the workflow finishes, the site is available at `https://sheralikuziyev4007.github.io/booking-app/`.

The Vite `base` path comes from the `VITE_BASE` variable (set to `/<repo-name>/` in the workflow). Locally and on a custom domain it is `/`.

## Author

Kuziyev Sherali — [GitHub](https://github.com/sheralikuziyev4007)

## License

[MIT](LICENSE) © Kuziyev Sherali
