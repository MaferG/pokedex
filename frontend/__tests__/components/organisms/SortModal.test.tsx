/**
 * Tests for SortModal component
 * @module __tests__/components/organisms/SortModal
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SortModal } from '@/components/organisms/sort-modal';

describe('SortModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSort: jest.fn(),
    currentSort: 'number' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when isOpen is true', () => {
    render(<SortModal {...defaultProps} />);
    expect(screen.getByText('Sort by:')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<SortModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Sort by:')).not.toBeInTheDocument();
  });

  it('displays both sort options', () => {
    render(<SortModal {...defaultProps} />);
    expect(screen.getByText('Number')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('shows current selection as checked', () => {
    render(<SortModal {...defaultProps} currentSort="number" />);
    const numberOption = screen.getByText('Number').previousSibling;
    expect(numberOption?.firstChild).toBeInTheDocument();
  });

  it('calls onSort when Number is clicked', async () => {
    const user = userEvent.setup();
    const onSort = jest.fn();

    render(<SortModal {...defaultProps} onSort={onSort} currentSort="name" />);
    await user.click(screen.getByText('Number'));

    expect(onSort).toHaveBeenCalledWith('number');
  });

  it('calls onSort when Name is clicked', async () => {
    const user = userEvent.setup();
    const onSort = jest.fn();

    render(<SortModal {...defaultProps} onSort={onSort} />);
    await user.click(screen.getByText('Name'));

    expect(onSort).toHaveBeenCalledWith('name');
  });

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(<SortModal {...defaultProps} onClose={onClose} />);
    const overlay = screen.getByText('Sort by:').parentElement?.parentElement;

    if (overlay) {
      await user.click(overlay);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it('does not call onClose when modal content is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(<SortModal {...defaultProps} onClose={onClose} />);
    const modalContent = screen.getByText('Sort by:').parentElement;

    if (modalContent) {
      await user.click(modalContent);
      expect(onClose).not.toHaveBeenCalled();
    }
  });

  it('updates selection visually when clicked', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<SortModal {...defaultProps} currentSort="number" />);

    await user.click(screen.getByText('Name'));

    rerender(<SortModal {...defaultProps} currentSort="name" />);

    const nameOption = screen.getByText('Name').previousSibling;
    expect(nameOption?.firstChild).toBeInTheDocument();
  });

  it('applies correct styling to modal', () => {
    render(<SortModal {...defaultProps} />);
    const modal = screen.getByText('Sort by:').parentElement;
    expect(modal).toHaveClass('bg-[#DC0A2D]', 'rounded-2xl');
  });
});
