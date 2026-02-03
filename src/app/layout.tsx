import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next"
import { BookmarkModal } from "@/components/bookmark/BookmarkModal";
import { Toaster } from 'sonner';

// Geist Mono as primary font everywhere (https://fonts.google.com/specimen/Geist+Mono)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/thumbs/Designdotweb logo.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <BookmarkModal />
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
