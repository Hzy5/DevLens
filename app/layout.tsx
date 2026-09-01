import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { SiteBackdrop } from "@/components/SiteBackdrop";
import { APP_DESCRIPTION, APP_NAME, APP_TITLE } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export const metadata: Metadata = {
  metadataBase: new URL(resolveSiteUrl()),
  title: APP_TITLE,
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: [
    "DevLens",
    "debugging",
    "stack trace",
    "crash log",
    "error analysis",
    "developer tools",
  ],
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    type: "website",
    url: "/",
    images: [
      {
        url: "/og.png",
        secureUrl: "/og.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "DevLens — Drop the error. See what's actually wrong.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full font-sans text-foreground">
        <AuthProvider>
          <SiteBackdrop />
          <div className="relative z-10 min-h-full">
            <a
              href="#debug"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:text-on-accent"
            >
              Skip to debug workspace
            </a>
            {children}
            <Analytics />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
