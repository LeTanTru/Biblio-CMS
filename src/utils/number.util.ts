export function formatMoney(value: string, delimiter: string = '.'): string {
  if (!value) return '';

  const numeric = value.toString().replace(/\D/g, '');
  if (numeric === '') return '';

  const reversed = numeric.split('').reverse();
  const chunks: string[] = [];

  for (let i = 0; i < reversed.length; i += 3) {
    chunks.push(reversed.slice(i, i + 3).join(''));
  }

  return chunks.join(delimiter).split('').reverse().join('');
}
