import atlasBg from "../assets/atlas-bg.svg";
import Logo from "./Logo";
import Icon from "./ui/Icon";
import { useI18n } from "../i18n/I18nProvider";
import { RESTAURANT } from "../config/restaurant";

// Restaurant "business card": full-height left column on desktop, compact banner on mobile.
export default function BrandPanel() {
  const { t, formatTime } = useI18n();

  // Facts come from the same config the booking rules use, so they never disagree
  const facts = [
    { icon: "clock", text: t("brand.hours", { from: formatTime(RESTAURANT.firstSeating), to: formatTime(RESTAURANT.lastSeating) }) },
    { icon: "calendarOff", text: t("brand.dayOff") },
    { icon: "users", text: t("brand.tables", { min: RESTAURANT.minGuests, max: RESTAURANT.maxGuests }) },
  ];

  return (
    <aside className="relative isolate overflow-hidden lg:h-dvh">
      <img src={atlasBg} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      {/* Bottom shade so the name stays readable over the pattern */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bg via-bg/55 to-bg/0" />

      <div className="flex h-full flex-col justify-between gap-3 px-5 pb-4 pt-4 sm:px-10 lg:min-h-0 lg:gap-8 lg:px-12 lg:pb-14 lg:pt-12">
        <Logo size={36} />

        <div>
          <h1 className="m-0">
            <span className="mb-1 block text-sm font-medium text-gold lg:mb-4 lg:text-base">{t("brand.kicker")}</span>
            <span className="block font-display text-[clamp(52px,10vw,156px)] font-semibold leading-[0.85] tracking-[-0.02em] text-ink">
              {t("brand.name")}
            </span>
          </h1>
          <p className="mt-4 hidden max-w-[30ch] text-[15px] leading-relaxed text-ink/80 sm:block lg:mt-6 lg:text-lg">
            {t("brand.tagline")}
          </p>

          <ul className="mt-9 hidden list-none space-y-3.5 p-0 lg:block">
            {facts.map(({ icon, text }) => (
              <li key={icon} className="flex items-center gap-3 text-sm text-ink/85">
                <Icon name={icon} size={18} className="shrink-0 text-gold" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Fabric selvedge between the pattern and the form */}
      <div className="selvedge-x absolute inset-x-0 bottom-0 h-1.5 lg:hidden" />
      <div className="selvedge-y absolute inset-y-0 right-0 hidden w-1.5 lg:block" />
    </aside>
  );
}
