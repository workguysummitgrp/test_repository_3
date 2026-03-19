import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChangeIndicator from '../../src/components/ui/ChangeIndicator';

describe('ChangeIndicator', () => {
  it('should display positive change in green', () => {
    render(<ChangeIndicator change={2.34} changePercent={1.25} />);
    const indicator = screen.getByText('▲');
    expect(indicator).toBeInTheDocument();
  });

  it('should display negative change in red', () => {
    render(<ChangeIndicator change={-1.5} changePercent={-0.75} />);
    const indicator = screen.getByText('▼');
    expect(indicator).toBeInTheDocument();
  });

  it('should format change values', () => {
    render(<ChangeIndicator change={2.34} changePercent={1.25} />);
    expect(screen.getByText('+2.34')).toBeInTheDocument();
    expect(screen.getByText('(+1.25%)')).toBeInTheDocument();
  });

  it('should hide icon when showIcon is false', () => {
    render(<ChangeIndicator change={2.34} changePercent={1.25} showIcon={false} />);
    expect(screen.queryByText('▲')).not.toBeInTheDocument();
  });
});
