import { Organization, WebSite, SoftwareApplication, FAQPage, Question } from 'schema-dts'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://mayura.rocks'

export const organizationSchema: Organization = {
  '@type': 'Organization',
  '@id': `${APP_URL}/#organization`,
  name: 'Mayura',
  alternateName: 'Mayura AI',
  url: APP_URL,
  logo: `${APP_URL}/logo_512.png`,
  description: 'Intelligent AI routing platform that automatically selects the best AI model for your specific task',
  foundingDate: '2024',
  founders: [
    {
      '@type': 'Person',
      name: 'Pavan Manish',
      url: 'https://github.com/pavanmanishd'
    },
    {
      '@type': 'Person', 
      name: 'Sai Vishal',
      url: 'https://github.com/saivishal'
    }
  ],
  sameAs: [
    'https://twitter.com/MayuraAI',
    'https://github.com/mayuraai'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: 'English'
  }
}

export const websiteSchema: WebSite = {
  '@type': 'WebSite',
  '@id': `${APP_URL}/#website`,
  url: APP_URL,
  name: 'Mayura - A Mixture of Models',
  description: 'Transform your AI workflow with intelligent routing. Access GPT-4, Claude, Gemini, and more automatically.',
  publisher: {
    '@id': `${APP_URL}/#organization`
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${APP_URL}/chat?q={search_term_string}`
    },
    // 'query-input': 'required name=search_term_string'
  }
}

export const softwareApplicationSchema: SoftwareApplication = {
  '@type': 'SoftwareApplication',
  '@id': `${APP_URL}/#software`,
  name: 'Mayura',
  description: 'Intelligent AI routing platform that automatically selects the best AI model for your specific task',
  url: APP_URL,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web Browser',
  offers: [
    {
      '@type': 'Offer',
      name: 'Free Plan',
      price: '0',
      priceCurrency: 'USD',
      description: '10 Max requests per day, unlimited standard requests'
    }
  ],
  author: {
    '@id': `${APP_URL}/#organization`
  },
  provider: {
    '@id': `${APP_URL}/#organization`
  },
  screenshot: `${APP_URL}/logo_512.png`,
  softwareVersion: '1.0.0',
  datePublished: '2024-01-01',
  featureList: [
    'Intelligent AI model routing',
    'Access to multiple AI models',
    'Automatic model selection',
    'Free tier available',
    'Real-time AI responses'
  ]
}

export const faqPageSchema: FAQPage = {
  '@type': 'FAQPage',
  '@id': `${APP_URL}/#faq`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Mayura?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mayura is an intelligent AI routing platform that automatically selects the best AI model for your specific task, eliminating the need to manually choose between different AI services.'
      }
    },
    {
      '@type': 'Question', 
      name: 'How does intelligent routing work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our advanced classification system analyzes your prompt and automatically routes it to the most suitable AI model based on the task type, ensuring optimal results every time.'
      }
    },
    {
      '@type': 'Question',
      name: 'What AI models does Mayura support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mayura supports leading AI models including GPT-4, Claude, Gemini 2.5 Pro, Llama 3.3, DeepSeek R1, and many others, with new models added regularly.'
      }
    },
    {
      '@type': 'Question',
      name: 'What\'s the difference between Standard and Max requests?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Standard requests use reliable, fast models perfect for everyday tasks. Max requests access the most advanced models available for complex reasoning, research, and critical work requiring the highest quality output.'
      }
    }
  ]
}

export function generateStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema,
      websiteSchema,
      softwareApplicationSchema,
      faqPageSchema
    ]
  }
} 