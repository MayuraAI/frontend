"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  Brain,
  Rocket,
  Zap,
  CheckCircle,
  Users,
  Code,
  Shield,
  BarChart3,
  Clock,
  DollarSign,
  Star,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  TrendingUp,
  DollarSign as DollarSignIcon,
  MessageSquare,
  Route
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      question: "How does Mayura work?",
      answer:
        "Mayura uses advanced AI classification to analyze your prompt and automatically route it to the most suitable LLM from our network. This ensures you get the best possible results for each specific task type."
    },
    {
      question: "What LLMs do you support?",
      answer:
        "We integrate with top-tier LLMs including OpenAI's GPT models, Anthropic's Claude, Google's Gemini, and other leading models. Our network is constantly expanding to include the latest and most capable models."
    },
    {
      question: "How accurate is the prompt classification?",
      answer:
        "Our classification system achieves over 95% accuracy in routing prompts to the optimal model. The system continuously learns and improves from user interactions and feedback."
    },
    {
      question: "How do you ensure privacy and security?",
      answer:
        "We implement enterprise-grade security measures including end-to-end encryption, zero-data retention policies, and SOC 2 compliance. Your prompts and data are never stored or used for training."
    },
    {
      question: "Is this a limited beta?",
      answer:
        "Yes, Mayura is currently in a public beta. The Free tier is available for everyone. The Pro tier and its features will be fully rolled out after the beta period."
    },
    {
      question: "What's the difference between request types?",
      answer:
        "Standard Requests use reliable models like GPT-4o and are great for everyday tasks. Pro Requests use the most powerful models available (like Claude 4 and Gemini 2.5 Pro) for complex reasoning, creative, and critical tasks."
    }
  ]

  return (
    <div className="flex w-full max-w-7xl flex-col items-center justify-center">
      {/* Header */}
      <header className="flex w-full items-center justify-between border-b p-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded bg-black p-2">
              <p className="font-bold text-white">M</p>
            </div>
            <h1 className="text-xl font-bold">Mayura</h1>
          </div>
          <div className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
            Beta
          </div>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#how-it-works"
            className="text-sm font-medium hover:underline"
          >
            How It Works
          </Link>
          <Link
            href="#features"
            className="text-sm font-medium hover:underline"
          >
            Features
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:underline">
            Pricing
          </Link>
          <Link href="#faq" className="text-sm font-medium hover:underline">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link href="/login">
              Get Started Free <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="w-full flex-1">
        {/* Hero Section */}
        <section className="w-full px-6 py-16 md:py-24 lg:py-32">
          <div className="container mx-auto py-12">
            <div className="mx-auto flex max-w-4xl flex-col items-center space-y-6 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  One Prompt, Right Model,{" "}
                  <span className="text-primary">Every Time</span>
                </h1>
                <p className="mx-auto max-w-3xl text-lg text-zinc-600 md:text-xl lg:text-2xl">
                  Get higher-quality results, faster responses, and lower costs
                  by using the perfect AI model for every task. Our smart
                  platform classifies your prompt and automatically routes it to
                  the best-performing LLM.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/login">
                    <Zap className="mr-2 size-5" /> Try Mayura Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#how-it-works">
                    <Brain className="mr-2 size-5" /> Learn More
                  </Link>
                </Button>
              </div>
              {/* Trust Indicators */}
              <div className="mt-8 flex items-center gap-4 text-sm text-zinc-500">
                <span>Powered by:</span>
                <div className="flex items-center gap-6">
                  <span className="font-medium">OpenAI</span>
                  <span className="font-medium">Claude</span>
                  <span className="font-medium">Gemini</span>
                  <span className="font-medium">+More</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full bg-zinc-50 py-16 md:py-12">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                The Magic Behind Mayura
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-zinc-600">
                Experience seamless AI power in three simple, intelligent steps.
              </p>
            </div>
            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <Card className="flex flex-col items-center p-6 text-center">
                <CardHeader className="flex flex-col items-center pb-4">
                  <div className="bg-primary text-primary-foreground mb-4 flex size-14 items-center justify-center rounded-full">
                    <MessageSquare className="size-7" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    1. Your Brilliant Prompt
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-600">
                  <p>
                    Start by simply telling Mayura what you need. From complex
                    code to creative ideas, one place for all your AI tasks.
                  </p>
                </CardContent>
              </Card>
              {/* Step 2 */}
              <Card className="flex flex-col items-center p-6 text-center">
                <CardHeader className="flex flex-col items-center pb-4">
                  <div className="bg-primary text-primary-foreground mb-4 flex size-14 items-center justify-center rounded-full">
                    <Route className="size-7" />
                  </div>
                  <CardTitle
                    className="text-xl font-semibold"
                    dangerouslySetInnerHTML={{
                      __html: "2. Mayura&apos;s Smart Routing"
                    }}
                  />
                </CardHeader>
                <CardContent className="text-zinc-600">
                  <p>
                    Our intelligent AI instantly understands your prompt&apos;s
                    intent and magically routes it to the absolute best LLM for
                    the job.
                  </p>
                </CardContent>
              </Card>
              {/* Step 3 */}
              <Card className="flex flex-col items-center p-6 text-center">
                <CardHeader className="flex flex-col items-center pb-4">
                  <div className="bg-primary text-primary-foreground mb-4 flex size-14 items-center justify-center rounded-full">
                    <Lightbulb className="size-7" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    3. Superior Results, Instantly
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-600">
                  <p>
                    Voila! Receive precise, high-quality, and cost-efficient
                    results, tailored by the perfect AI model, every single
                    time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Why Choose Mayura?
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-zinc-600">
                Stop juggling multiple AI platforms. Get better results with
                less effort.
              </p>
            </div>
            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Star className="text-primary mb-2 size-8" />
                  <CardTitle>Higher Quality Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600">
                    Leverage the unique strengths of each top-tier LLM for
                    unparalleled output quality.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Clock className="text-primary mb-2 size-8" />
                  <CardTitle>Faster Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600">
                    Eliminate manual switching and get answers quicker with
                    automatic routing.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <DollarSignIcon className="text-primary mb-2 size-8" />
                  <CardTitle>Lower Costs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600">
                    Optimize spending by using the most efficient model for each
                    specific task.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Zap className="text-primary mb-2 size-8" />
                  <CardTitle>Simplified Workflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600">
                    One platform to manage all AI interactions. No more juggling
                    multiple tabs and accounts.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Rocket className="text-primary mb-2 size-8" />
                  <CardTitle>Future-Proof</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600">
                    Automatically adapts as new and better LLMs emerge in the
                    market.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Brain className="text-primary mb-2 size-8" />
                  <CardTitle>Focus on Your Work</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600">
                    Spend less time managing AI tools, more time on what matters
                    most.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* --- START: RESTRUCTURED PRICING SECTION --- */}
        <section id="pricing" className="w-full bg-zinc-50 py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-zinc-600">
                Get full access during our beta. The Pro plan will be available
                after this period.
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl items-start gap-8 md:grid-cols-2">
              {/* Free Plan */}
              <Card className="flex h-full flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Free</h3>
                    <div className="w-fit rounded-full border border-green-200 bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      Available Now
                    </div>
                  </div>
                  <p className="pt-2 text-sm text-zinc-500">
                    Perfect for students, hobbyists, and light usage.
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">$0</span>
                      <span className="text-lg font-medium text-zinc-500">
                        /month
                      </span>
                    </div>
                    <p className="mb-4 font-semibold text-zinc-700">
                      Core Features:
                    </p>
                    <ul className="space-y-4 text-sm">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 shrink-0 text-green-500" />
                        <div>
                          <strong>10 Pro Requests / day</strong>
                          <p className="text-xs text-zinc-500">
                            Use for premium models like Claude 4, Gemini 2.5
                            Pro, GPT-O3
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 shrink-0 text-green-500" />
                        <div>
                          <strong>Unlimited Standard Requests</strong>
                          <p className="text-xs text-zinc-500">
                            Use for models like Gemini-2.5 Flash, GPT-4o,
                            Deepseek R1
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 shrink-0 text-green-500" />
                        <div>Intelligent Routing</div>
                      </li>
                    </ul>
                  </div>
                  <Button className="mt-8 w-full" asChild>
                    <Link href="/login">Get Started Free</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="border-primary relative flex h-full flex-col border-2">
                <div className="bg-primary text-primary-foreground absolute -top-4 left-1/2 w-fit -translate-x-1/2 rounded-full px-4 py-1 text-sm font-medium">
                  Recommended
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Pro</h3>
                    <div className="w-fit rounded-full border border-orange-200 bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                      Coming Soon
                    </div>
                  </div>
                  <p className="pt-2 text-sm text-zinc-500">
                    For professionals and teams who need the best AI has to
                    offer.
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">$10</span>
                      <span className="text-lg font-medium text-zinc-500">
                        /month
                      </span>
                    </div>
                    <p className="mb-4 font-semibold text-zinc-700">
                      Everything in Free, plus:
                    </p>
                    <ul className="space-y-4 text-sm">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="text-primary size-5 shrink-0" />
                        <div>
                          <strong>100 Pro Requests / day</strong>
                          <p className="text-xs text-zinc-500">
                            Use for premium models like Claude 4, Gemini 2.5
                            Pro, GPT-O3
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="text-primary size-5 shrink-0" />
                        <div>
                          <strong>Unlimited Standard Requests</strong>
                          <p className="text-xs text-zinc-500">
                            Use for models like Gemini-2.5 Flash, GPT-4o,
                            Deepseek R1
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="text-primary size-5 shrink-0" />
                        <div>Advanced Intelligent Routing</div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="text-primary size-5 shrink-0" />
                        <div>Priority Chat Support</div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="text-primary size-5 shrink-0" />
                        <div>API Access</div>
                      </li>
                    </ul>
                  </div>
                  <Button className="mt-8 w-full" variant="default" disabled>
                    Upgrade to Pro
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        {/* --- END: RESTRUCTURED PRICING SECTION --- */}

        {/* About Us Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
                Built by Engineers, for Everyone
              </h2>
              <p className="mb-8 text-lg text-zinc-600">
                We experienced the frustration of constantly switching between
                different AI models, never knowing which one would work best for
                our specific needs. That&apos;s why we built Mayura - to
                eliminate the guesswork and deliver the right AI solution every
                time.
              </p>
              <p className="text-zinc-600">
                Our mission is to democratize access to the world&apos;s best AI
                models through intelligent routing, making advanced AI
                capabilities accessible to individuals, startups, and
                enterprises alike.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full bg-zinc-50 py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="mx-auto max-w-3xl">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-zinc-200 last:border-b-0"
                >
                  <button
                    className="flex w-full items-center justify-between py-6 text-left"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-semibold">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="size-5 text-zinc-500" />
                    ) : (
                      <ChevronDown className="size-5 text-zinc-500" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="pb-6">
                      <p className="text-zinc-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Ready to Transform Your AI Workflow?
              </h2>
              <p className="mb-8 text-lg text-zinc-600">
                Join our beta and start upgrading your AI experience with Mayura
                today.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/login">
                    <Zap className="mr-2 size-5" /> Get Started Free
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#pricing">
                    <DollarSignIcon className="mr-2 size-5" /> View Pricing
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-zinc-50 py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded bg-black p-2">
                  <p className="font-bold text-white">M</p>
                </div>
                <h3 className="font-bold">Mayura</h3>
              </div>
              <p className="mb-4 text-sm text-zinc-600">
                Intelligent AI routing for superior results, every time.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>
                  <Link href="#features" className="hover:underline">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:underline">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:underline">
                    API Docs
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:underline">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>
                  <Link href="/about" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:underline">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:underline">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:underline">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Support</h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>
                  <Link href="/help" className="hover:underline">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:underline">
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:underline">
                    Status
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:underline">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between border-t border-zinc-200 pt-8 sm:flex-row">
            <p className="text-xs text-zinc-600">
              © 2025 Mayura. All rights reserved. Currently in Beta.
            </p>
            <nav className="mt-4 flex gap-6 sm:mt-0">
              <Link
                href="/privacy"
                className="text-xs text-zinc-600 hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-zinc-600 hover:underline"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-xs text-zinc-600 hover:underline"
              >
                Cookie Policy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
