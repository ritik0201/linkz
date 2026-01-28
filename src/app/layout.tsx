import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Collab Bharat",
  description: "Collab Bharat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA Manifest Link */}
        <link rel="icon" href="/logo.gif" type="image/gif" />
        <link rel="manifest" href="/manifest.json" />

        {/* Stop Google Translate Popup */}
        <meta name="google" content="notranslate" />

        {/* Theme Color for Mobile */}
        <meta name="theme-color" content="#000000" />
      </head>

      <body>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}