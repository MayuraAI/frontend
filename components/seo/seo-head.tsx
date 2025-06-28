import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'product'
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  keywords?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  noindex?: boolean
  nofollow?: boolean
}

export function SEOHead({
  title = "Mayura - A Mixture of Models",
  description = "Transform your AI workflow with Mayura's intelligent routing system. Access the best AI models automatically - from GPT-4 to Claude, Gemini, and more. Get superior results with zero hassle.",
  canonical,
  ogImage = "/opengraph-image",
  ogType = "website",
  twitterCard = "summary_large_image",
  keywords = "AI routing, artificial intelligence, GPT-4, Claude, Gemini, AI platform, machine learning, intelligent routing, AI workflow, productivity, automation",
  author = "Mayura Team",
  publishedTime,
  modifiedTime,
  noindex = false,
  nofollow = false
}: SEOHeadProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mayura.rocks'
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`
  
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow'
  ].join(', ')

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content="Mayura" />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific tags */}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === 'article' && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@MayuraAI" />
      <meta name="twitter:creator" content="@MayuraAI" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}/twitter-image`} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#9B59B6" />
      <meta name="msapplication-TileColor" content="#9B59B6" />
      <meta name="application-name" content="Mayura" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Mayura" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch for external resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
    </Head>
  )
} 