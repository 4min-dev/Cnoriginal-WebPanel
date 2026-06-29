export function getPiceStr(price: number | null) {
  return price ? `${Number(price)} ₽` : "-";
}
