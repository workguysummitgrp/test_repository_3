import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from '../../src/components/ui/EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No results found" />);
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="Empty" description="Try a different search." />);
    expect(screen.getByText('Try a different search.')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="Empty" />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(0);
  });

  it('renders action element when provided', () => {
    render(<EmptyState title="Empty" action={<button>Click me</button>} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<EmptyState title="Empty" icon={<span data-testid="icon">\u2605</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('uses h3 heading for title (accessibility)', () => {
    render(<EmptyState title="Empty State" />);
    const heading = screen.getByText('Empty State');
    expect(heading.tagName).toBe('H3');
  });
});
