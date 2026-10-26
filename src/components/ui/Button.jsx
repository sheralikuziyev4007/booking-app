// Единая кнопка проекта. Варианты и размеры заменяют дублирующиеся строки классов.

const BASE =
  "inline-flex items-center justify-center gap-2 cursor-pointer select-none transition-colors duration-150 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold " +
  "disabled:opacity-40 disabled:cursor-not-allowed";

const VARIANTS = {
  primary:
    "bg-gold border border-gold text-[#1B1405] font-semibold enabled:hover:bg-[#F0C25E] enabled:hover:border-[#F0C25E] enabled:active:translate-y-px",
  secondary: "bg-transparent border border-edge text-ink enabled:hover:border-goldDim enabled:hover:bg-surface2",
  danger: "bg-transparent border border-danger/50 text-danger enabled:hover:bg-dangerBg enabled:hover:border-danger",
  icon: "bg-transparent border border-edge text-ink enabled:hover:border-gold enabled:hover:text-gold",
  iconFilled: "bg-surface2 border border-edge text-ink enabled:hover:border-gold enabled:hover:text-gold",
};

const SIZES = {
  md: "px-5 py-3 text-sm rounded-xl",
  sm: "px-3.5 py-2 text-[13px] rounded-lg",
  icon: "w-10 h-10 rounded-full",
};

export default function Button({ variant = "primary", size = "md", type = "button", className = "", ...props }) {
  const classes = [BASE, VARIANTS[variant], SIZES[size], className].filter(Boolean).join(" ");
  return <button type={type} className={classes} {...props} />;
}
