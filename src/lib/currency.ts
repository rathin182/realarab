import { Currency } from '../types';
import { CURRENCY_RATES } from '../data/websiteContent';

export function formatPrice(priceInSAR: number, currency: Currency): string {
  const { rate, symbol } = CURRENCY_RATES[currency];
  const converted = priceInSAR * rate;

  if (converted >= 1_000_000) {
    const formattedNum = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
    }).format(converted);
    return `${symbol} ${formattedNum}`;
  }

  const formattedNum = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(converted);
  return `${symbol} ${formattedNum}`;
}

export function formatCurrencyValue(amount: number, currency: Currency): string {
  const { symbol } = CURRENCY_RATES[currency];
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return `${symbol} ${formatted}`;
}
