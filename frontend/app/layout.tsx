import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Pokédex - Explore the World of Pokemon",
  description: "A comprehensive Pokédex application to explore and discover Pokemon with detailed information about their abilities, moves, and forms.",
  keywords: ["pokemon", "pokedex", "pokemon list", "pokemon details"],
  authors: [{ name: "Pokédex Team" }],
  openGraph: {
    title: "Pokédex - Explore the World of Pokemon",
    description: "Discover Pokemon with detailed information about their abilities, moves, and forms.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
