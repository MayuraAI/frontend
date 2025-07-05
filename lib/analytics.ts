import posthog from 'posthog-js'

// Track specific user actions
export const analytics = {
  // Track user identification (when they log in)
  identify: (userId: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && posthog) {
      posthog.identify(userId, properties)
    }
  },

  // Track specific user actions
  track: (eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && posthog) {
      posthog.capture(eventName, properties)
    }
  },

  // Track page views with custom properties
  pageView: (pageName: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && posthog) {
      posthog.capture('page_viewed', {
        page_name: pageName,
        ...properties
      })
    }
  },

  // Track feature usage
  featureUsed: (featureName: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && posthog) {
      posthog.capture('feature_used', {
        feature_name: featureName,
        ...properties
      })
    }
  },

  // Reset user session (on logout)
  reset: () => {
    if (typeof window !== 'undefined' && posthog) {
      posthog.reset()
    }
  },

  // Set user properties
  setUserProperties: (properties: Record<string, any>) => {
    if (typeof window !== 'undefined' && posthog) {
      posthog.setPersonProperties(properties)
    }
  }
}

// Helper function to check if PostHog is loaded
export const isPostHogLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!posthog
}