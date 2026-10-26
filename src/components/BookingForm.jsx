import { useId } from "react";
import Field from "./ui/Field";
import Input from "./ui/Input";
import Button from "./ui/Button";
import Icon from "./ui/Icon";
import StepHeading from "./ui/StepHeading";
import { guestsWord } from "../utils/plural";
import { formatPhone } from "../utils/formatPhone";

export default function BookingForm({ formData, setFormData, errors }) {
  const uid = useId();
  const id = (name) => `${uid}-${name}`;
  const upd = (k, v) => setFormData((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <StepHeading title="Ваши данные" hint="Контакты нужны, чтобы подтвердить бронь." />

      <Field label="Имя" htmlFor={id("name")} error={errors.name}>
        <Input
          id={id("name")}
          error={errors.name}
          value={formData.name}
          placeholder="Как к вам обращаться"
          autoComplete="name"
          onChange={(e) => upd("name", e.target.value)}
        />
      </Field>

      <div className="grid gap-x-3 sm:grid-cols-2">
        <Field label="Телефон" htmlFor={id("phone")} error={errors.phone}>
          <Input
            id={id("phone")}
            type="tel"
            inputMode="tel"
            error={errors.phone}
            value={formData.phone}
            placeholder="+998 90 123 45 67"
            autoComplete="tel"
            onChange={(e) => upd("phone", formatPhone(e.target.value))}
          />
        </Field>
        <Field label="Email" htmlFor={id("email")} error={errors.email}>
          <Input
            id={id("email")}
            type="email"
            error={errors.email}
            value={formData.email}
            placeholder="name@mail.com"
            autoComplete="email"
            onChange={(e) => upd("email", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Количество гостей" htmlFor={id("guests")}>
        <div className="flex items-center gap-4">
          <Button
            variant="iconFilled"
            size="icon"
            aria-label="Уменьшить количество гостей"
            onClick={() => upd("guests", Math.max(1, formData.guests - 1))}
          >
            <Icon name="minus" />
          </Button>
          <output id={id("guests")} className="w-9 text-center font-display text-4xl font-semibold leading-none tabular-nums">
            {formData.guests}
          </output>
          <Button
            variant="iconFilled"
            size="icon"
            aria-label="Увеличить количество гостей"
            onClick={() => upd("guests", Math.min(10, formData.guests + 1))}
          >
            <Icon name="plus" />
          </Button>
          <span className="text-[13px] text-muted">{guestsWord(formData.guests)} (макс. 10)</span>
        </div>
      </Field>

      <Field label="Комментарий (необязательно)" htmlFor={id("comment")}>
        <Input
          as="textarea"
          id={id("comment")}
          className="min-h-[56px] resize-y"
          value={formData.comment}
          placeholder="Пожелания к столику, аллергии и т.д."
          onChange={(e) => upd("comment", e.target.value)}
        />
      </Field>
    </div>
  );
}
