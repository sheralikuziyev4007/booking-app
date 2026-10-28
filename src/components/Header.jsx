import Button from "./ui/Button";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "../i18n/I18nProvider";

export default function Header({ showBookingsButton, onOpenBookings }) {
  const { t } = useI18n();

  return (
    <header className="mb-3 flex min-h-[38px] items-center justify-between gap-3">
      <p className="m-0 text-sm text-muted">{t("header.title")}</p>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        {showBookingsButton && (
          <Button variant="secondary" size="sm" onClick={onOpenBookings}>
            {t("header.myBookings")}
          </Button>
        )}
      </div>
    </header>
  );
}
