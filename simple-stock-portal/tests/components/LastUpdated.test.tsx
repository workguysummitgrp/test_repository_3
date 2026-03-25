import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LastUpdated from '../../src/components/ui/LastUpdated';

describe('LastUpdated', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when fetchedAt is null', () => {
    const { container } = render(<LastUpdated fetchedAt={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when fetchedAt is undefined', () => {
    const { container } = render(<LastUpdated fetchedAt={undefined} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when fetchedAt is 0', () => {
    const { container } = render(<LastUpdated fetchedAt={0} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when fetchedAt is negative', () => {
    const { container } = render(<LastUpdated fetchedAt={-1} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders "Last updated:" with relative time for valid timestamp', () => {
    const now = 1711382400000;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    render(<LastUpdated fetchedAt={now - 120_000} />);
    const el = screen.getByText(/Last updated:/);
    expect(el).toBeInTheDocument();
    expect(el.textContent).toContain('2 minutes ago');
  });

  it('renders a <time> element with datetime attribute', () => {
    const now = 1711382400000;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    render(<LastUpdated fetchedAt={now - 30_000} />);
    const timeEl = screen.getByText(/Last updated:/);
    expect(timeEl.tagName.toLowerCase()).toBe('time');
    expect(timeEl).toHaveAttribute('datetime');
  });

  it('has title attribute with absolute time for hover tooltip', () => {
    const now = 1711382400000;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    render(<LastUpdated fetchedAt={now - 30_000} />);
    const timeEl = screen.getByText(/Last updated:/);
    expect(timeEl).toHaveAttribute('title');
    const title = timeEl.getAttribute('title') || '';
    expect(title.length).toBeGreaterThan(0);
  });

  it('has appropriate CSS classes for muted gray text', () => {
    const now = 1711382400000;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    render(<LastUpdated fetchedAt={now - 30_000} />);
    const timeEl = screen.getByText(/Last updated:/);
    expect(timeEl.className).toContain('text-sm');
    expect(timeEl.className).toContain('text-gray-500');
  });

  it('renders "Just now" for very recent timestamps', () => {
    const now = 1711382400000;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    render(<LastUpdated fetchedAt={now - 5_000} />);
    expect(screen.getByText(/Just now/)).toBeInTheDocument();
  });
});
