import { useId } from "react";
import Field from "./ui/Field";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { guestsWord } from "../utils/plural";

export default function BookingForm({ formData, setFormData, errors }) {
  const uid = useId();
  const id = (name) => `${uid}-${name}`;
  const upd = (k, v) => setFormData((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <p className="font-display text-[17px] text-ink mb-4">Ваши данные</p>

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

      <div className="grid grid-cols-2 gap-3">
        <Field label="Телефон" htmlFor={id("phone")} error={errors.phone}>
          <Input
            id={id("phone")}
            type="tel"
            error={errors.phone}
            value={formData.phone}
            placeholder="+998 90 123 45 67"
            autoComplete="tel"
            onChange={(e) => upd("phone", e.target.value)}
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
        <div className="flex items-center gap-3">
          <Button
            variant="iconFilled"
            size="icon"
            aria-label="Уменьшить количество гостей"
            onClick={() => upd("guests", Math.max(1, formData.guests - 1))}
          >
            −
          </Button>
          <output id={id("guests")} className="font-mono text-[15px] w-6 text-center">
            {formData.guests}
          </output>
          <Button
            variant="iconFilled"
            size="icon"
            aria-label="Увеличить количество гостей"
            onClick={() => upd("guests", Math.min(10, formData.guests + 1))}
          >
            +
          </Button>
          <span className="text-xs text-muted">{guestsWord(formData.guests)} (макс. 10)</span>
        </div>
      </Field>

      <Field label="Комментарий (необязательно)" htmlFor={id("comment")}>
        <Input
          as="textarea"
          id={id("comment")}
          className="resize-y min-h-[60px]"
          value={formData.comment}
          placeholder="Пожелания к столику, аллергии и т.д."
          onChange={(e) => upd("comment", e.target.value)}
        />
      </Field>
    </div>
  );
}
