import { Toaster } from "@/components/ui/sonner"
import { GlobalState } from "@/components/utility/global-state"
import { Providers } from "@/components/utility/providers"
import { Database } from "@/supabase/types"
import { createServerClient } from "@supabase/ssr"
import { Metadata, Viewport } from "next"
import { DM_Sans } from "next/font/google"
import { cookies } from "next/headers"
import { ReactNode } from "react"
import { generateStructuredData } from "@/lib/seo/structured-data"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"]
})

const APP_NAME = "Mayura"
const APP_DEFAULT_TITLE = "Mayura - A Mixture of Models"
const APP_TITLE_TEMPLATE = "%s | Mayura"
const APP_DESCRIPTION = "Transform your AI workflow with Mayura's intelligent routing system."
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://mayura.rocks"
const APP_KEYWORDS = "AI routing, artificial intelligence, GPT-4, Claude, Gemini, AI platform, machine learning, intelligent routing, AI workflow, productivity, automation"

interface RootLayoutProps {
  children: ReactNode
}

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE
  },
  description: APP_DESCRIPTION,
  keywords: APP_KEYWORDS,
  authors: [
    { name: "Pavan Manish", url: "https://github.com/pavanmanishd" },
    { name: "Sai Vishal", url: "https://github.com/saivishal" }
  ],
  creator: "Mayura Team",
  publisher: "Mayura",
  category: "Technology",
  classification: "AI Platform",
  manifest: "/manifest.json",
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
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: APP_URL,
  },
  icons: {
    icon: [
      { url: "/logo_32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo_192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo_512.png", sizes: "512x512", type: "image/png" }
    ],
    shortcut: "/logo_32.png",
    apple: [
      { url: "/logo_192.png", sizes: "192x192", type: "image/png" }
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/logo_512.png",
        color: "#9B59B6"
      }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
    startupImage: [
      {
        url: "/logo_512.png",
        media: "(device-width: 768px) and (device-height: 1024px)"
      }
    ]
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: APP_NAME,
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - A Mixture of Models`,
        type: "image/png"
      },
      {
        url: "/logo_512.png",
        width: 512,
        height: 512,
        alt: `${APP_NAME} Logo - A Mixture of Models`,
        type: "image/png"
      },
      {
        url: "/logo_192.png",
        width: 192,
        height: 192,
        alt: `${APP_NAME} Logo`,
        type: "image/png"
      }
    ],
    videos: [],
    audio: []
  },
  twitter: {
    card: "summary_large_image",
    site: "@MayuraAI",
    creator: "@MayuraAI",
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/twitter-image",
        alt: `${APP_NAME} - A Mixture of Models`,
        width: 1200,
        height: 630
      }
    ]
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-TileColor": "#9B59B6",
    "msapplication-TileImage": "/logo_192.png",
    "msapplication-navbutton-color": "#9B59B6",
    "application-name": APP_NAME,
    "msapplication-tooltip": APP_DESCRIPTION,
    "msapplication-starturl": "/",
    "msapplication-window": "width=1024;height=768",
    "msapplication-task": "name=Home;action-uri=/;icon-uri=/logo_32.png"
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#9B59B6" },
    { media: "(prefers-color-scheme: dark)", color: "#0F0F0F" }
  ],
  colorScheme: "dark light"
}

export default async function RootLayout({
  children
}: RootLayoutProps) {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )
  const session = (await supabase.auth.getSession()).data.session
  const structuredData = generateStructuredData()

  return (
    <html lang="en" className="dark">
      <head>
        {/* Explicit Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@MayuraAI" />
        <meta name="twitter:creator" content="@MayuraAI" />
        <meta name="twitter:title" content={APP_DEFAULT_TITLE} />
        <meta name="twitter:description" content={APP_DESCRIPTION} />
        <meta name="twitter:image" content={`${APP_URL}/preview.png`} />
        <meta name="twitter:image:alt" content="Mayura - A Mixture of Models" />
        
        {/* Explicit Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Mayura" />
        <meta property="og:title" content={APP_DEFAULT_TITLE} />
        <meta property="og:description" content={APP_DESCRIPTION} />
        <meta property="og:image" content={`${APP_URL}/preview.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Mayura - A Mixture of Models" />
        <meta property="og:url" content={APP_URL} />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-EGJ0GQYWM8"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-EGJ0GQYWM8');
            `
          }}
        />
      </head>
      <body className={`${dmSans.variable} font-sans antialiased`} style={{backgroundColor: '#0F0F0F', color: '#F5F5F5'}}>
        <Providers>
          <Toaster richColors position="top-center" duration={3000} />
          <div className="flex min-h-screen w-full flex-col" style={{backgroundColor: '#0F0F0F', color: '#F5F5F5'}}>
            {session ? <GlobalState>{children}</GlobalState> : children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
