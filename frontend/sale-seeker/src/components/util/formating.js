export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
});

export function makeFirstLetterUpperCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}
