import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "استمارة تشخيص مؤسسات الرعاية الاجتماعية",
  description: "نظام إدارة بيانات مؤسسات الرعاية الاجتماعية - دور الطالب والطالبة",
  generator: "v0.app",
  icons: {
    icon: '/images/entraide-logo.png',
    apple: '/images/entraide-logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#3b5998',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans antialiased min-h-screen bg-background">
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
