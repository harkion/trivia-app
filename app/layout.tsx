import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DarkVeil from "./components/DarkVeil";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiz Craft",
  description: "Fast-paced trivia game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Background */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
          }}
        >
          <DarkVeil
            hueShift={200}
            noiseIntensity={0.04}
            scanlineIntensity={0.1}
            scanlineFrequency={2}
            warpAmount={0.2}
            speed={0.4}
          />
        </div>

        {/* App content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
