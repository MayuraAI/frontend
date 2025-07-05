import { useEffect, useRef, useState } from 'react'
import { analytics, safeExecute } from '@/lib/analytics'

export const useAnalytics = () => {
  const sessionStartTime = useRef<number>(Date.now())
  const pageViewCount = useRef<number>(0)
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(false)

  useEffect(() => {
    // Check if this is a first visit
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore')
    if (!hasVisitedBefore) {
      setIsFirstVisit(true)
      localStorage.setItem('hasVisitedBefore', 'true')
      safeExecute(() => {
        analytics.uniqueVisitor.firstVisit()
      })
    } else {
      // Calculate days since last visit
      const lastVisit = localStorage.getItem('lastVisit')
      if (lastVisit) {
        const daysSinceLastVisit = Math.floor((Date.now() - parseInt(lastVisit)) / (1000 * 60 * 60 * 24))
        safeExecute(() => {
          analytics.uniqueVisitor.returnVisit(daysSinceLastVisit)
        })
      }
    }

    // Update last visit timestamp
    localStorage.setItem('lastVisit', Date.now().toString())

    // Track session end on page unload
    const handleBeforeUnload = () => {
      const sessionDuration = Math.floor((Date.now() - sessionStartTime.current) / 1000)
      safeExecute(() => {
        analytics.uniqueVisitor.sessionEnd(sessionDuration, pageViewCount.current)
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const trackPageView = (pageName: string, properties?: Record<string, any>) => {
    pageViewCount.current += 1
    safeExecute(() => {
      analytics.pageView(pageName, properties)
    })
  }

  const trackUserAction = (action: string, context?: Record<string, any>) => {
    safeExecute(() => {
      analytics.userAction(action, context)
    })
  }

  const trackFeatureUsage = (featureName: string, properties?: Record<string, any>) => {
    safeExecute(() => {
      analytics.featureUsed(featureName, properties)
    })
  }

  const trackConversion = (conversionType: string, value?: number, properties?: Record<string, any>) => {
    safeExecute(() => {
      analytics.conversion(conversionType, value, properties)
    })
  }

  const identifyUser = (userId: string, properties?: Record<string, any>) => {
    safeExecute(() => {
      analytics.identify(userId, properties)
    })
  }

  const trackOnboardingStep = (step: string, completed: boolean, properties?: Record<string, any>) => {
    safeExecute(() => {
      analytics.onboardingStep(step, completed, properties)
    })
  }

  const trackError = (errorType: string, errorMessage: string, properties?: Record<string, any>) => {
    safeExecute(() => {
      analytics.error(errorType, errorMessage, properties)
    })
  }

  const resetUser = () => {
    safeExecute(() => {
      analytics.reset()
    })
  }

  return {
    isFirstVisit,
    trackPageView,
    trackUserAction,
    trackFeatureUsage,
    trackConversion,
    identifyUser,
    trackOnboardingStep,
    trackError,
    resetUser
  }
} 