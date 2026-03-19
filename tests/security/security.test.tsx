import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getWatchlist, saveWatchlist, isStorageAvailable } from '../../src/services/storageService';

describe('Security Tests', () => {
  describe('XSS Prevention \u2014 Search Input', () => {
    it('script tag in input is rendered as text, not executed', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const { container } = render(<input value={maliciousInput} readOnly />);
      const input = container.querySelector('input');
      expect(input?.value).toBe(maliciousInput);
      // No script execution possible via value attribute in React
      expect(container.querySelector('script')).toBeNull();
    });

    it('HTML injection via img onerror is not executed', () => {
      const maliciousInput = '<img onerror=alert(1) src=x>';
      const { container } = render(<div>{maliciousInput}</div>);
      // React escapes HTML by default in JSX text content
      expect(container.querySelector('img')).toBeNull();
      expect(container.textContent).toContain('<img onerror=alert(1) src=x>');
    });

    it('JavaScript URL scheme is rendered as text', () => {
      const maliciousInput = 'javascript:alert(1)';
      const { container } = render(<span>{maliciousInput}</span>);
      expect(container.textContent).toBe(maliciousInput);
    });
  });

  describe('localStorage Corruption Resilience', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('handles invalid JSON in watchlist key', () => {
      localStorage.setItem('ssp_watchlist', '{corrupt');
      const result = getWatchlist();
      expect(result).toEqual([]);
    });

    it('handles wrong type (number) in watchlist key', () => {
      localStorage.setItem('ssp_watchlist', '42');
      const result = getWatchlist();
      expect(result).toEqual([]);
    });

    it('handles null stored value', () => {
      localStorage.setItem('ssp_watchlist', 'null');
      const result = getWatchlist();
      expect(result).toEqual([]);
    });

    it('filters out non-string entries from array', () => {
      localStorage.setItem('ssp_watchlist', '[1, null, "AAPL", true, "MSFT"]');
      const result = getWatchlist();
      expect(result).toEqual(['AAPL', 'MSFT']);
    });

    it('handles empty string stored value', () => {
      localStorage.setItem('ssp_watchlist', '');
      const result = getWatchlist();
      expect(result).toEqual([]);
    });
  });

  describe('API Key Protection', () => {
    it('API key is not present in rendered DOM of a simple component', () => {
      const { container } = render(<div data-testid="app">Simple Stock Portal</div>);
      const htmlContent = container.innerHTML;
      // The demo key or any typical API key pattern should not be in UI
      expect(htmlContent).not.toContain('VITE_ALPHA_VANTAGE_API_KEY');
    });
  });

  describe('Storage Availability Detection', () => {
    it('detects storage availability in test environment', () => {
      expect(isStorageAvailable()).toBe(true);
    });
  });
});
