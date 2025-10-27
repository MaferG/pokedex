/**
 * Tests for TypeBadge component
 * @module __tests__/components/atoms/TypeBadge
 */

import { render, screen } from '@testing-library/react';
import { TypeBadge } from '@/components/atoms/type-badge';

describe('TypeBadge', () => {
  it('renders with the correct Pokemon type', () => {
    render(<TypeBadge type="fire" />);
    expect(screen.getByText('fire')).toBeInTheDocument();
  });

  it('capitalizes the type name', () => {
    render(<TypeBadge type="water" />);
    const badge = screen.getByText('water');
    expect(badge).toHaveClass('capitalize');
  });

  it('applies fire type color', () => {
    render(<TypeBadge type="fire" />);
    const badge = screen.getByText('fire');
    expect(badge).toHaveStyle({ backgroundColor: '#F57D31' });
  });

  it('applies water type color', () => {
    render(<TypeBadge type="water" />);
    const badge = screen.getByText('water');
    expect(badge).toHaveStyle({ backgroundColor: '#6493EB' });
  });

  it('applies grass type color', () => {
    render(<TypeBadge type="grass" />);
    const badge = screen.getByText('grass');
    expect(badge).toHaveStyle({ backgroundColor: '#74CB48' });
  });

  it('applies electric type color', () => {
    render(<TypeBadge type="electric" />);
    const badge = screen.getByText('electric');
    expect(badge).toHaveStyle({ backgroundColor: '#F9CF30' });
  });

  it('applies default color for unknown type', () => {
    render(<TypeBadge type="unknown" />);
    const badge = screen.getByText('unknown');
    expect(badge).toHaveStyle({ backgroundColor: '#AAA67F' });
  });

  it('handles case-insensitive type names', () => {
    render(<TypeBadge type="FIRE" />);
    const badge = screen.getByText('FIRE');
    expect(badge).toHaveStyle({ backgroundColor: '#F57D31' });
  });

  it('applies correct CSS classes', () => {
    render(<TypeBadge type="dragon" />);
    const badge = screen.getByText('dragon');
    expect(badge).toHaveClass('px-4', 'py-1', 'rounded-full', 'text-white');
  });
});
