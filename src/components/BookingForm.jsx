import { useId } from "react";
import Field from "./ui/Field";
import Input from "./ui/Input";
import StepHeading from "./ui/StepHeading";
import { useI18n } from "../i18n/I18nProvider";
import { nextPhoneValue } from "../utils/formatPhone";

// Contact details. `errors` holds error codes from validateBookingForm; they are translated here.
// Editing a field clears its error right away instead of waiting for the next "Next" click.
export default function BookingForm({ formData, setFormData, errors, onClearError }) {
  const { t } = useI18n();
  const uid = useId();
  const id = (name) => `${uid}-${name}`;
  const upd = (k, v) => {
    setFormData((f) => ({ ...f, [k]: v }));
    if (errors[k]) onClearError(k);
  };
  const err = (name) => (errors[name] ? t(`errors.${errors[name]}`) : undefined);

  return (
    <div>
      <StepHeading title={t("form.title")} hint={t("form.hint")} />

      <Field label={t("form.name")} htmlFor={id("name")} error={err("name")}>
        <Input
          id={id("name")}
          error={err("name")}
          value={formData.name}
          placeholder={t("form.namePlaceholder")}
          autoComplete="name"
          onChange={(e) => upd("name", e.target.value)}
        />
      </Field>

      <div className="grid gap-x-3 sm:grid-cols-2">
        <Field label={t("form.phone")} htmlFor={id("phone")} error={err("phone")} hint={t("form.phoneHint")}>
          <Input
            id={id("phone")}
            type="tel"
            inputMode="tel"
            error={err("phone")}
            hint={t("form.phoneHint")}
            value={formData.phone}
            placeholder={t("form.phonePlaceholder")}
            autoComplete="tel"
            onChange={(e) => {
              const raw = e.target.value;
              setFormData((f) => ({ ...f, phone: nextPhoneValue(f.phone, raw) }));
              if (errors.phone) onClearError("phone");
            }}
          />
        </Field>
        <Field label={t("form.email")} htmlFor={id("email")} error={err("email")}>
          <Input
            id={id("email")}
            type="email"
            error={err("email")}
            value={formData.email}
            placeholder={t("form.emailPlaceholder")}
            autoComplete="email"
            onChange={(e) => upd("email", e.target.value)}
          />
        </Field>
      </div>

      <Field label={t("form.comment")} htmlFor={id("comment")}>
        <Input
          as="textarea"
          id={id("comment")}
          className="min-h-[72px] resize-y"
          value={formData.comment}
          placeholder={t("form.commentPlaceholder")}
          onChange={(e) => upd("comment", e.target.value)}
        />
      </Field>
    </div>
  );
}
