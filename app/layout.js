import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: {
    default: "SheopurStationaryHub - Quality Office Supplies & Stationery in Sheopur",
    template: "%s | SheopurStationaryHub"
  },
  description: "Buy premium quality office supplies, stationery, notebooks, pens, and more in Sheopur. Fast delivery, best prices, and 100% satisfaction guaranteed. Shop now at SheopurStationaryHub!",
  keywords: [
    "stationary shop Sheopur",
    "office supplies Sheopur",
    "notebooks Sheopur",
    "pens Sheopur",
    "stationery online Sheopur",
    "school supplies",
    "office products",
    "writing materials",
    "desk accessories",
    "SheopurStationaryHub"
  ],
  authors: [{ name: "SheopurStationaryHub" }],
  creator: "SheopurStationaryHub",
  publisher: "SheopurStationaryHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "SheopurStationaryHub - Quality Office Supplies & Stationery",
    description: "Buy premium quality office supplies, stationery, notebooks, pens, and more in Sheopur. Fast delivery and best prices.",
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: "SheopurStationaryHub",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SheopurStationaryHub - Quality Office Supplies',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SheopurStationaryHub - Quality Office Supplies",
    description: "Buy premium quality office supplies and stationery in Sheopur",
    images: ['/og-image.jpg'],
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
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="flex flex-col min-h-screen">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "SheopurStationaryHub",
              "description": "Premium quality office supplies and stationery shop in Sheopur",
              "url": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
              "logo": `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/logo.png`,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Sheopur",
                "addressRegion": "MP",
                "addressCountry": "IN"
              },
              "priceRange": "₹₹",
              "telephone": "+91-XXXXXXXXXX",
              "openingHours": "Mo-Su 09:00-21:00",
              "paymentAccepted": "Cash, Credit Card, Debit Card, UPI",
              "currenciesAccepted": "INR"
            })
          }}
        />
      </body>
    </html>
  );
}
