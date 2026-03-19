import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SkeletonCard from '../../src/components/ui/SkeletonCard';

describe('SkeletonCard', () => {
  it('renders with animate-pulse class', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders default 3 skeleton lines', () => {
    const { container } = render(<SkeletonCard />);
    // 1 header line + 3 content lines
    const lines = container.querySelectorAll('.bg-gray-100, .bg-gray-200');
    expect(lines.length).toBeGreaterThanOrEqual(3);
  });

  it('renders custom number of lines', () => {
    const { container } = render(<SkeletonCard lines={5} />);
    const contentLines = container.querySelectorAll('.bg-gray-100');
    expect(contentLines).toHaveLength(5);
  });

  it('applies custom className', () => {
    const { container } = render(<SkeletonCard className="w-full" />);
    expect(container.firstElementChild?.classList.contains('w-full')).toBe(true);
  });
});
