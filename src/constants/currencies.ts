// Currency order used consistently across the application
export const CURRENCY_ORDER = ["HUF", "USD", "EUR", "GBP"] as const;

// Type for valid currencies
export type ValidCurrency = typeof CURRENCY_ORDER[number];
