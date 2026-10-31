import { CustomCursor } from "@/components/CustomCursor";
import { IntroLoader } from "@/components/IntroLoader";
import { Navbar } from "@/components/Navbar";
import { ScrollProgress } from "@/components/ScrollProgress";
import type { Metadata } from "next";
import { Space_Grotesk, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/data";
import { CommandMenu } from "@/components/CommandMenu";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  // 👇 THIS IS THE FIX: Resolves the warning and prevents broken social preview images
  metadataBase: new URL("https://portfolio-hitmansharuk15.vercel.app"), 
  
  title: `${site.name} — Creative Developer`,
  description: `${site.tagline} Explore the digital portfolio of ${site.name}.`,
  keywords: ["Creative Developer", "Frontend Engineer", "UI/UX Design", site.name],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portfolio-hitmansharuk15.vercel.app", 
    title: `${site.name} — Creative Developer`,
    description: `${site.tagline} Explore the digital portfolio of ${site.name}.`,
    siteName: `${site.name} Portfolio`,
    images: [
      {
        url: "/profile.jpeg", 
        width: 1200,
        height: 630,
        alt: `${site.name} Portfolio Preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Creative Developer`,
    description: `${site.tagline}`,
    images: ["/profile.jpeg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-ink text-paper font-shout antialiased">
        <IntroLoader />   
        <CustomCursor />
        <ScrollProgress />
        <CommandMenu />
        <Navbar />
        {children}
      </body>
    </html>
  );
}