import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from '../../src/components/ui/SearchInput';

describe('SearchInput', () => {
  it('renders with default placeholder', () => {
    render(<SearchInput value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText('Search by ticker or company name\u2026')).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const handleChange = vi.fn();
    render(<SearchInput value="" onChange={handleChange} />);
    fireEvent.change(screen.getByPlaceholderText('Search by ticker or company name\u2026'), {
      target: { value: 'AAPL' },
    });
    expect(handleChange).toHaveBeenCalledWith('AAPL');
  });

  it('shows loading spinner when isLoading is true', () => {
    const { container } = render(<SearchInput value="test" onChange={() => {}} isLoading />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('does not show spinner when not loading', () => {
    const { container } = render(<SearchInput value="test" onChange={() => {}} isLoading={false} />);
    expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
  });

  it('renders compact mode with Quick search placeholder', () => {
    render(<SearchInput value="" onChange={() => {}} compact />);
    expect(screen.getByPlaceholderText('Quick search\u2026')).toBeInTheDocument();
  });

  it('renders with autoFocus', () => {
    render(<SearchInput value="" onChange={() => {}} autoFocus />);
    const input = screen.getByPlaceholderText('Search by ticker or company name\u2026');
    expect(input).toHaveAttribute('autofocus');
  });

  it('displays the current value', () => {
    render(<SearchInput value="TSLA" onChange={() => {}} />);
    expect(screen.getByDisplayValue('TSLA')).toBeInTheDocument();
  });
});
