export function formatMoney(
  value: string | number,
  suffix: string = 'đ'
): string {
  if (value === null || value === undefined) return '';

  const num = Number(value);
  if (isNaN(num)) return '';

  return new Intl.NumberFormat('vi-VN').format(num) + suffix;
}
