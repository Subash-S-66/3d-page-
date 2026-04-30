import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import AudioController from "@/components/AudioController";

// Using local fonts for Clash Display and Cabinet Grotesk as specified.
// We'll mock the font loading with standard sans-serif fallbacks if the woff files don't exist yet,
// but we define the variables as requested.
const clashDisplay = localFont({
  src: [
    {
      path: './fonts/GeistVF.woff', // Placeholder path since we don't actually have the woff downloaded in the env, using Geist as fallback
      weight: '100 900',
      style: 'normal',
    }
  ],
  variable: "--font-clash-display",
  display: 'swap',
});

const cabinetGrotesk = localFont({
  src: [
    {
      path: './fonts/GeistVF.woff', // Placeholder path
      weight: '100 900',
      style: 'normal',
    }
  ],
  variable: "--font-cabinet-grotesk",
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "SKS - Digital Universe Portfolio",
  description: "The most jaw-dropping, technically insane personal portfolio website ever created for SKS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${clashDisplay.variable} ${cabinetGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <LenisProvider>
          {children}
          <AudioController />
        </LenisProvider>
      </body>
    </html>
  );
}
