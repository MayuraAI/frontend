'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { usePathname } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/resqW",
    person_profiles: 'always', // Create profiles for all users (logged in and anonymous)
    capture_pageview: false, // We'll manually capture pageviews
    capture_pageleave: true, // Keep pageleave events for session analytics
    session_recording: {
      recordCrossOriginIframes: false,
      maskAllInputs: true,
    },
    loaded: function (posthog) {
      if (process.env.NODE_ENV === 'development') {
        console.log('PostHog loaded successfully')
      }
    }
  })
  posthog.debug(false)
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PostHogProvider>
  )
}

function PostHogPageView(): JSX.Element {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      
      // Capture pageview for all users
      posthog.capture('$pageview', {
        '$current_url': url,
        '$pathname': pathname,
        '$search_params': searchParams.toString(),
        'page_type': pathname.includes('/chat') ? 'chat' : 
                    pathname.includes('/login') ? 'auth' : 
                    pathname.includes('/setup') ? 'setup' : 'general'
      })
    }
  }, [pathname, searchParams])

  return <></>
}
