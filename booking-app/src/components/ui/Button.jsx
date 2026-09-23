// Единая кнопка проекта. Варианты и размеры заменяют дублирующиеся строки классов.

const BASE =
  "rounded-md cursor-pointer transition-colors " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const VARIANTS = {
  primary: "bg-gold border border-gold text-[#20180A] font-semibold",
  secondary: "bg-transparent border border-edge text-ink",
  danger: "bg-transparent border border-danger text-danger",
  icon: "bg-transparent border border-edge text-ink",
  iconFilled: "bg-surface2 border border-edge text-ink",
};

const SIZES = {
  md: "px-[18px] py-2.5 text-[13px]",
  sm: "px-3.5 py-1.5 text-[13px]",
  icon: "w-7 h-7 text-base leading-none flex items-center justify-center",
};

export default function Button({ variant = "primary", size = "md", type = "button", className = "", ...props }) {
  const classes = [BASE, VARIANTS[variant], SIZES[size], className].filter(Boolean).join(" ");
  return <button type={type} className={classes} {...props} />;
}
