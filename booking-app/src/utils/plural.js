// Склонение существительных после числительного: 1 гость, 2 гостя, 5 гостей

export function pluralize(n, [one, few, many]) {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

export function guestsWord(n) {
  return pluralize(n, ["гость", "гостя", "гостей"]);
}
