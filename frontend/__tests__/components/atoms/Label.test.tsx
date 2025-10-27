/**
 * Tests for Label component
 * @module __tests__/components/atoms/Label
 */

import { render, screen } from '@testing-library/react';
import { Label } from '@/components/atoms/label';

describe('Label', () => {
  it('renders label with text', () => {
    render(<Label>Username</Label>);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('associates with input via htmlFor', () => {
    render(
      <>
        <Label htmlFor="username">Username</Label>
        <input id="username" />
      </>
    );

    const label = screen.getByText('Username');
    expect(label).toHaveAttribute('for', 'username');
  });

  it('renders with custom className', () => {
    render(<Label className="custom-label">Label</Label>);
    expect(screen.getByText('Label')).toHaveClass('custom-label');
  });

  it('applies default styling classes', () => {
    render(<Label>Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('text-sm', 'font-medium');
  });

  it('renders children correctly', () => {
    render(
      <Label>
        Required <span className="text-red-500">*</span>
      </Label>
    );

    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
