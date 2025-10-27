/**
 * Tests for PokemonCard component
 * @module __tests__/components/molecules/PokemonCard
 */

import { render, screen } from '@testing-library/react';
import { PokemonCard } from '@/components/molecules/pokemon-card';

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('PokemonCard', () => {
  const mockPokemon = {
    id: 25,
    name: 'pikachu',
    image: 'https://example.com/pikachu.png',
  };

  it('renders Pokemon name', () => {
    render(<PokemonCard {...mockPokemon} />);
    expect(screen.getByText('pikachu')).toBeInTheDocument();
  });

  it('renders Pokemon ID with proper formatting', () => {
    render(<PokemonCard {...mockPokemon} />);
    expect(screen.getByText('#025')).toBeInTheDocument();
  });

  it('formats ID with leading zeros for single digits', () => {
    render(<PokemonCard id={1} name="bulbasaur" image="test.png" />);
    expect(screen.getByText('#001')).toBeInTheDocument();
  });

  it('formats ID with leading zeros for double digits', () => {
    render(<PokemonCard id={50} name="diglett" image="test.png" />);
    expect(screen.getByText('#050')).toBeInTheDocument();
  });

  it('does not add leading zeros for three digit IDs', () => {
    render(<PokemonCard id={150} name="mewtwo" image="test.png" />);
    expect(screen.getByText('#150')).toBeInTheDocument();
  });

  it('renders Pokemon image with correct src', () => {
    render(<PokemonCard {...mockPokemon} />);
    const image = screen.getByAltText('pikachu');
    expect(image).toHaveAttribute('src', mockPokemon.image);
  });

  it('links to Pokemon detail page', () => {
    render(<PokemonCard {...mockPokemon} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/pokemon/25');
  });

  it('capitalizes Pokemon name in display', () => {
    render(<PokemonCard {...mockPokemon} />);
    const name = screen.getByText('pikachu');
    expect(name).toHaveClass('capitalize');
  });

  it('uses placeholder image when image is not provided', () => {
    render(<PokemonCard id={1} name="test" image="" />);
    const image = screen.getByAltText('test');
    expect(image).toHaveAttribute('src', '/placeholder.png');
  });

  it('applies hover effects', () => {
    render(<PokemonCard {...mockPokemon} />);
    const card = screen.getByRole('link').firstChild as HTMLElement;
    expect(card).toHaveClass('hover:shadow-[0_6px_12px_rgba(0,0,0,0.15)]');
  });
});
