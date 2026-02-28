import '@testing-library/jest-dom/vitest';

// Polyfill ResizeObserver for Radix UI components in jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

