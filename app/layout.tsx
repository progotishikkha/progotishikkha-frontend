import type { Metadata } from "next";
import { Sora, Inter, Noto_Sans_Bengali } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/Toaster";
import "@/styles/globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Progoti Shikkha — Find Trusted Tutors in Bangladesh",
    template: "%s | Progoti Shikkha",
  },
  description:
    "Progoti Shikkha connects students with verified, experienced tutors across Bangladesh. Post a tuition requirement or apply as a tutor — free and open education for all.",
  keywords: ["tuition", "tutor", "Bangladesh", "home tutor", "online tutor", "প্রগতি শিক্ষা"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Progoti Shikkha — Find Trusted Tutors in Bangladesh",
    description: "Connecting students with verified tutors across Bangladesh.",
    siteName: "Progoti Shikkha",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sora.variable} ${inter.variable} ${notoBengali.variable} font-body antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <NotificationProvider>
              <Navbar />
              <main className="min-h-[60vh]">{children}</main>
              <Footer />
              <Toaster />
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
