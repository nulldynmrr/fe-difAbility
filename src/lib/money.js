export function formatMoney(amount, options = {}) {
  if (amount == null || isNaN(amount)) return "-";

  const {
    locale = "id-ID",
    currency = "IDR",
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}
