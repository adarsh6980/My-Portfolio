const runtimeConfig = (globalThis as typeof globalThis & {
  __PORTFOLIO_CONFIG__?: { apiUrl?: string };
}).__PORTFOLIO_CONFIG__;

export const APP_CONFIG = {
  apiUrl: runtimeConfig?.apiUrl ?? 'http://localhost:5050',
  canonicalUrl: '[ADD CANONICAL DOMAIN]',
} as const;
