import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Collab Bharat",
  description: "Collab Bharat",

  // ✅ Tab Icon / Favicon
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  // ✅ Open Graph Preview (Google, WhatsApp, LinkedIn)
  openGraph: {
    title: "Collab Bharat",
    description: "Collab Bharat",
    siteName: "Collab Bharat",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Collab Bharat Logo",
      },
    ],
    type: "website",
  },

  // ✅ Twitter Card Preview
  twitter: {
    card: "summary_large_image",
    title: "Collab Bharat",
    description: "Collab Bharat",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* ✅ Stop Google Translate Popup */}
        <meta name="google" content="notranslate" />

        {/* ✅ Theme Color */}
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