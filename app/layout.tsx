import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SokaStore Kenya | Premium Football Jerseys & Sports Apparel",
    template: "%s | SokaStore Kenya"
  },
  description: "Shop authentic football jerseys, sports apparel, and custom team kits at SokaStore Kenya. Get the latest Premier League, La Liga, Serie A, and international team jerseys with fast delivery across Kenya. Quality guaranteed.",
  keywords: [
    "football jerseys Kenya",
    "soccer jerseys Nairobi",
    "sports apparel Kenya",
    "custom team kits",
    "Premier League jerseys",
    "La Liga jerseys",
    "authentic football shirts",
    "SokaStore",
    "sports merchandise Kenya",
    "football gear Kenya",
    "team jerseys customization"
  ],
  authors: [{ name: "SokaStore Kenya" }],
  creator: "SokaStore Kenya",
  publisher: "SokaStore Kenya",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://soccastore.co.ke'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: '/',
    siteName: 'SokaStore Kenya',
    title: 'SokaStore Kenya | Premium Football Jerseys & Sports Apparel',
    description: 'Shop authentic football jerseys, sports apparel, and custom team kits at SokaStore Kenya. Fast delivery across Kenya with quality guaranteed.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SokaStore Kenya - Premium Football Jerseys',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SokaStore Kenya | Premium Football Jerseys & Sports Apparel',
    description: 'Shop authentic football jerseys and sports apparel with fast delivery across Kenya.',
    images: ['/og-image.jpg'],
    creator: '@sokastore',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          {children}
          <Toaster position="top-center" richColors />
        </CartProvider>
      </body>
    </html>
  );
}
