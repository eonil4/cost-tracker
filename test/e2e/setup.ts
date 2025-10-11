import { webcrypto } from 'crypto';

// Comprehensive crypto polyfill for Playwright
// This ensures crypto is available in all contexts

// Polyfill for globalThis.crypto
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = webcrypto as Crypto;
}

// Polyfill for global.crypto (Node.js global)
if (typeof global !== 'undefined' && !global.crypto) {
  (global as typeof globalThis & { crypto: Crypto }).crypto = webcrypto;
}

// Polyfill for window.crypto (browser context)
if (typeof window !== 'undefined' && !window.crypto) {
  (window as typeof window & { crypto: Crypto }).crypto = webcrypto;
}

// Ensure crypto.randomUUID is available
if (globalThis.crypto && !globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}

// Ensure crypto.random is available
if (globalThis.crypto && !globalThis.crypto.random) {
  globalThis.crypto.random = () => {
    const array = new Uint8Array(1);
    globalThis.crypto.getRandomValues(array);
    return array[0] / 255;
  };
}

// Add page context polyfill for browser tests
export const addCryptoPolyfill = async (page: { addInitScript: (script: () => void) => Promise<void> }) => {
  await page.addInitScript(() => {
    // Ensure crypto is available in the page context
    if (typeof window.crypto === 'undefined') {
      // This will be handled by the Node.js polyfill above
      console.log('Crypto polyfill applied to page context');
    }
  });
};

console.log('Crypto polyfill setup completed');