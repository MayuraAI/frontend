import { Toaster } from "@/components/ui/sonner"
import { GlobalState } from "@/components/utility/global-state"
import { Providers } from "@/components/utility/providers"
import { Database } from "@/supabase/types"
import { createServerClient } from "@supabase/ssr"
import { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"
import { ReactNode } from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const APP_NAME = "Mayura AI"
const APP_DEFAULT_TITLE = "Mayura AI - Intelligent Routing Assistant"
const APP_TITLE_TEMPLATE = "%s - Mayura AI"
const APP_DESCRIPTION = "Your intelligent routing assistant. Connect with the best AI model for every task."

interface RootLayoutProps {
  children: ReactNode
  params: {
    locale: string
  }
}

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: APP_DEFAULT_TITLE
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE
    },
    description: APP_DESCRIPTION
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE
    },
    description: APP_DESCRIPTION
  }
}

export const viewport: Viewport = {
  themeColor: "hsl(262 83% 58%)"
}

export default async function RootLayout({
  children,
  params: { locale }
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

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers attribute="class" defaultTheme="dark">
          <Toaster richColors position="top-center" duration={3000} />
          <div className="flex h-screen w-full flex-col items-center overflow-hidden bg-background text-foreground">
            {session ? <GlobalState>{children}</GlobalState> : children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
