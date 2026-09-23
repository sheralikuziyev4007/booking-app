// Интеграционный тест: весь сценарий бронирования в jsdom (время зафиксировано: среда 23.09.2026, 14:00)
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import App from "./App";

const click = (el) => fireEvent.click(el);
const btn = (name) => screen.getByRole("button", { name });

function setNow(y, mo, d, h, mi) {
  vi.setSystemTime(new Date(y, mo, d, h, mi));
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers({ toFake: ["Date"] });
  setNow(2026, 8, 23, 14, 0); // среда 23.09.2026, 14:00
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("полный сценарий бронирования", () => {
  it("календарь: понедельник и прошедшие даты заблокированы, сегодня доступно", () => {
    render(<App />);
    expect(screen.getByText("Сентябрь 2026")).toBeTruthy();
    expect(btn("28 сентября, понедельник").disabled).toBe(true); // выходной
    expect(btn("22 сентября, вторник").disabled).toBe(true); // прошло
    expect(btn("23 сентября, среда").disabled).toBe(false); // сегодня
    expect(btn("24 сентября, четверг").disabled).toBe(false);
    expect(btn("Предыдущий месяц").disabled).toBe(true);
  });

  it("сегодня прошедшие слоты недоступны", () => {
    render(<App />);
    click(btn("23 сентября, среда"));
    click(btn("Далее"));
    expect(btn("12:00").disabled).toBe(true);
    expect(btn("14:00").disabled).toBe(true);
    expect(btn("14:30").disabled).toBe(false);
    expect(btn("22:00").disabled).toBe(false);
  });

  it("после 22:00 сегодняшняя дата заблокирована", () => {
    setNow(2026, 8, 23, 22, 30);
    render(<App />);
    expect(btn("23 сентября, среда").disabled).toBe(true);
    expect(btn("24 сентября, четверг").disabled).toBe(false);
  });

  it("нельзя перейти дальше без даты/времени; форма валидируется", () => {
    render(<App />);
    expect(btn("Далее").disabled).toBe(true);
    click(btn("24 сентября, четверг"));
    click(btn("Далее"));
    expect(btn("Далее").disabled).toBe(true);
    click(btn("18:30"));
    click(btn("Далее"));
    // пустая форма → ошибки, остаёмся на шаге 3
    click(btn("Далее"));
    expect(screen.getByText("Введите имя (минимум 2 символа).")).toBeTruthy();
    expect(screen.getByText("Введите корректный номер телефона.")).toBeTruthy();
    expect(screen.getByText("Введите корректный email.")).toBeTruthy();
    expect(screen.getByLabelText("Имя").getAttribute("aria-invalid")).toBe("true");
  });

  it("бронь → успех → список (склонение) → отмена → слот снова свободен", () => {
    render(<App />);
    click(btn("24 сентября, четверг"));
    click(btn("Далее"));
    click(btn("18:30"));
    click(btn("Далее"));

    fireEvent.change(screen.getByLabelText("Имя"), { target: { value: "Алишер" } });
    fireEvent.change(screen.getByLabelText("Телефон"), { target: { value: "+998 90 123 45 67" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@mail.com" } });
    click(btn("Увеличить количество гостей")); // 3
    expect(screen.getByText(/гостя \(макс\. 10\)/)).toBeTruthy();
    click(btn("Далее"));

    expect(screen.getByText("24 сентября, четверг")).toBeTruthy(); // родительный падеж
    click(btn("Подтвердить бронирование"));
    expect(screen.getByText("Бронь подтверждена")).toBeTruthy();
    expect(JSON.parse(localStorage.getItem("atlas-restaurant-bookings"))).toHaveLength(1);

    click(btn("Мои брони"));
    expect(screen.getByText(/3 гостя/)).toBeTruthy();
    expect(screen.getByText("Предстоящая")).toBeTruthy();

    // слот занят
    click(btn("+ Новая бронь"));
    click(btn("24 сентября, четверг"));
    click(btn("Далее"));
    expect(btn("18:30").disabled).toBe(true);

    // отмена → слот свободен
    click(btn("Мои брони"));
    click(btn("Отменить"));
    expect(screen.getByText("Отменена")).toBeTruthy();
    click(btn("+ Новая бронь"));
    click(btn("24 сентября, четверг"));
    click(btn("Далее"));
    expect(btn("18:30").disabled).toBe(false);
  });

  it("если слот успел пройти, пока заполнялась форма, бронь не создаётся", () => {
    render(<App />);
    click(btn("23 сентября, среда"));
    click(btn("Далее"));
    click(btn("15:00"));
    click(btn("Далее"));
    fireEvent.change(screen.getByLabelText("Имя"), { target: { value: "Алишер" } });
    fireEvent.change(screen.getByLabelText("Телефон"), { target: { value: "+998 90 123 45 67" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@mail.com" } });
    click(btn("Далее"));

    setNow(2026, 8, 23, 15, 10); // время слота уже прошло
    click(btn("Подтвердить бронирование"));

    expect(screen.getByText("Это время уже недоступно. Пожалуйста, выберите другое.")).toBeTruthy();
    expect(localStorage.getItem("atlas-restaurant-bookings")).toBeNull();
    expect(btn("15:00").disabled).toBe(true);
  });

  it("повреждённые данные в localStorage не ломают приложение", () => {
    localStorage.setItem("atlas-restaurant-bookings", JSON.stringify({ broken: true }));
    render(<App />);
    expect(screen.getByText("Сентябрь 2026")).toBeTruthy();
  });

  it("кнопка «Назад» возвращает на предыдущий шаг, данные сохраняются", () => {
    render(<App />);
    click(btn("24 сентября, четверг"));
    click(btn("Далее"));
    click(btn("13:00"));
    click(btn("Назад"));
    expect(btn("24 сентября, четверг").getAttribute("aria-pressed")).toBe("true");
  });

  it("1 гость → «гость»", () => {
    localStorage.setItem(
      "atlas-restaurant-bookings",
      JSON.stringify([{ id: "1", number: "АТ-1", date: "2026-09-30", time: "12:00", name: "Тест", phone: "", email: "", guests: 1, comment: "", status: "active" }])
    );
    render(<App />);
    click(btn("Мои брони"));
    expect(screen.getByText(/· 1 гость$/)).toBeTruthy();
  });
});
