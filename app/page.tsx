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
import { AIRoutingAnimation } from "@/components/hero/ai-routing-animation"

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
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-slate-900 to-black">
      {/* Header */}
      <header className="flex w-full items-center justify-between border-b border-slate-700 bg-black/20 p-6 shadow-sm backdrop-blur-sm">
        <a href="/">
          <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="rounded bg-violet-600 p-2">
                  <p className="font-bold text-white">M</p>
                </div>
                  <h1 className="text-xl font-bold text-white">Mayura</h1>
              </div>
            <div className="rounded-full border border-violet-600 bg-violet-900/20 px-3 py-1 text-xs font-medium text-violet-300">
              Beta
            </div>
          </div>
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#how-it-works"
            className="text-base font-medium text-slate-300 hover:text-violet-400 hover:underline"
          >
            How It Works
          </Link>
          <Link
            href="#features"
            className="text-base font-medium text-slate-300 hover:text-violet-400 hover:underline"
          >
            Features
          </Link>
          <Link href="#pricing" className="text-base font-medium text-slate-300 hover:text-violet-400 hover:underline">
            Pricing
          </Link>
          <Link href="#faq" className="text-base font-medium text-slate-300 hover:text-violet-400 hover:underline">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button asChild className="bg-violet-600 text-white hover:bg-violet-700">
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
            <div className="mx-auto flex flex-col items-center gap-12 md:flex-row md:items-stretch md:gap-20">
              {/* Left: Hero Text */}
              <div className="flex flex-1 flex-col justify-center space-y-6 text-center md:items-start md:justify-center md:text-left">
                <div className="space-y-4">
                  <h1
                    className="relative select-text bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
                  >
                    <span className="hero-select-hide">One Prompt</span>{" "}<br />
                    <span
                      className="hero-select-show bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg"
                    >
                      {"{ "}Right Model{" }"}
                    </span><br />
                    <span className="hero-select-hide bg-clip-text text-transparent">Every Time</span>
                    <style jsx>{`
                      .hero-select-hide::selection {
                        color: white !important;
                        background: white !important;
                      }
                      .hero-select-show::selection {
                        color: #a21caf !important;
                        background: white !important;
                        -webkit-text-fill-color: #a21caf !important;
                      }
                    `}</style>
                  </h1>
                  <p className="mx-auto max-w-2xl text-xs text-slate-300 md:mx-0 md:text-sm lg:text-base">
                    Smart AI routing for better results, lower costs.
                  </p>
                </div>
                <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                  <Button size="lg" asChild className="bg-violet-600 text-white hover:bg-violet-700">
                    <Link href="/login">
                      <Zap className="mr-2 size-5" /> Try Mayura Now
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-violet-600 text-violet-400 hover:bg-violet-900/20">
                    <Link href="#how-it-works">
                      <Brain className="mr-2 size-5" /> Learn More
                    </Link>
                  </Button>
                </div>
              </div>
              {/* Right: Animation */}
              <div className="flex min-w-[340px] flex-1 items-center justify-center">
                <AIRoutingAnimation />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-16 md:py-12">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                The Magic Behind Mayura
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-300">
                Experience seamless AI power in three simple, intelligent steps.
              </p>
            </div>
            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <Card className="flex flex-col items-center border-slate-700 bg-black/30 p-6 text-center shadow-sm backdrop-blur-sm">
                <CardHeader className="flex flex-col items-center pb-4">
                  <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-violet-600 text-white">
                    <MessageSquare className="size-7" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-white">
                    1. Your Brilliant Prompt
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300">
                  <p>
                    Start by simply telling Mayura what you need. From complex
                    code to creative ideas, one place for all your AI tasks.
                  </p>
                </CardContent>
              </Card>
              {/* Step 2 */}
              <Card className="flex flex-col items-center border-slate-700 bg-black/30 p-6 text-center shadow-sm backdrop-blur-sm">
                <CardHeader className="flex flex-col items-center pb-4">
                  <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-violet-600 text-white">
                    <Route className="size-7" />
                  </div>
                  <CardTitle
                    className="text-xl font-semibold text-white"
                    dangerouslySetInnerHTML={{
                      __html: "2. Mayura&apos;s Smart Routing"
                    }}
                  />
                </CardHeader>
                <CardContent className="text-slate-300">
                  <p>
                    Our intelligent AI instantly understands your prompt&apos;s
                    intent and magically routes it to the absolute best LLM for
                    the job.
                  </p>
                </CardContent>
              </Card>
              {/* Step 3 */}
              <Card className="flex flex-col items-center border-slate-700 bg-black/30 p-6 text-center shadow-sm backdrop-blur-sm">
                <CardHeader className="flex flex-col items-center pb-4">
                  <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-violet-600 text-white">
                    <Lightbulb className="size-7" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-white">
                    3. Superior Results, Instantly
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300">
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
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Why Choose Mayura?
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-300">
                Stop juggling multiple AI platforms. Get better results with
                less effort.
              </p>
            </div>
            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-slate-700 bg-black/30 shadow-sm backdrop-blur-sm">
                <CardHeader>
                  <Star className="mb-2 size-8 text-violet-400" />
                  <CardTitle className="text-white">Higher Quality Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">
                    Leverage the unique strengths of each top-tier LLM for
                    unparalleled output quality.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-slate-700 bg-black/30 shadow-sm backdrop-blur-sm">
                <CardHeader>
                  <Clock className="mb-2 size-8 text-violet-400" />
                  <CardTitle className="text-white">Faster Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">
                    Eliminate manual switching and get answers quicker with
                    automatic routing.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-slate-700 bg-black/30 shadow-sm backdrop-blur-sm">
                <CardHeader>
                  <DollarSignIcon className="mb-2 size-8 text-violet-400" />
                  <CardTitle className="text-white">Lower Costs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">
                    Optimize spending by using the most efficient model for each
                    specific task.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-slate-700 bg-black/30 shadow-sm backdrop-blur-sm">
                <CardHeader>
                  <Zap className="mb-2 size-8 text-violet-400" />
                  <CardTitle className="text-white">Simplified Workflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">
                    One platform to manage all AI interactions. No more juggling
                    multiple tabs and accounts.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-slate-700 bg-black/30 shadow-sm backdrop-blur-sm">
                <CardHeader>
                  <Rocket className="mb-2 size-8 text-violet-400" />
                  <CardTitle className="text-white">Future-Proof</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">
                    Automatically adapts as new and better LLMs emerge in the
                    market.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-slate-700 bg-black/30 shadow-sm backdrop-blur-sm">
                <CardHeader>
                  <Brain className="mb-2 size-8 text-violet-400" />
                  <CardTitle className="text-white">Focus on Your Work</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">
                    Spend less time managing AI tools, more time on what matters
                    most.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* --- START: RESTRUCTURED PRICING SECTION --- */}
        <section id="pricing" className="w-full py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-300">
                Get full access during our beta. The Pro plan will be available
                after this period.
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl items-start gap-8 md:grid-cols-2">
              {/* Free Plan */}
              <Card className="flex h-full flex-col border-slate-700 bg-black/30 shadow-sm backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">Free</h3>
                    <div className="w-fit rounded-full border border-violet-600 bg-violet-900/20 px-3 py-1 text-xs font-medium text-violet-300">
                      Available Now
                    </div>
                  </div>
                  <p className="pt-2 text-sm text-slate-400">
                    Perfect for students, hobbyists, and light usage.
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-white">$0</span>
                      <span className="text-lg font-medium text-slate-400">
                        /month
                      </span>
                    </div>
                    <p className="mb-4 font-semibold text-slate-200">
                      Core Features:
                    </p>
                    <ul className="space-y-4 text-sm">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 shrink-0 text-violet-400" />
                        <div>
                          <strong className="text-white">10 Pro Requests / day</strong>
                          <p className="text-xs text-slate-400">
                            Use for premium models like Claude 4, Gemini 2.5
                            Pro, GPT-O3
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 shrink-0 text-violet-400" />
                        <div>
                          <strong className="text-white">Unlimited Standard Requests</strong>
                          <p className="text-xs text-slate-400">
                            Use for models like Gemini-2.5 Flash, GPT-4o,
                            Deepseek R1
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 shrink-0 text-violet-400" />
                        <div className="text-white">Intelligent Routing</div>
                      </li>
                    </ul>
                  </div>
                  <Button className="mt-8 w-full bg-violet-600 text-white hover:bg-violet-700" asChild>
                    <Link href="/chat">Get Started Free</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="relative flex h-full flex-col border-2 border-violet-600 bg-black/30 shadow-sm backdrop-blur-sm">
                <div className="absolute -top-4 left-1/2 w-fit -translate-x-1/2 rounded-full bg-violet-600 px-4 py-1 text-sm font-medium text-white">
                  Recommended
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">Pro</h3>
                    <div className="w-fit rounded-full border border-orange-600 bg-orange-900/20 px-3 py-1 text-xs font-medium text-orange-300">
                      Coming Soon
                    </div>
                  </div>
                  <p className="pt-2 text-sm text-slate-400">
                    For professionals and teams who need the best AI has to
                    offer.
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-white">$10</span>
                      <span className="text-lg font-medium text-slate-400">
                        /month
                      </span>
                    </div>
                    <p className="mb-4 font-semibold text-slate-200">
                      Everything in Free, plus:
                    </p>
                    <ul className="space-y-4 text-sm">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 shrink-0 text-violet-400" />
                        <div>
                          <strong className="text-white">100 Pro Requests / day</strong>
                          <p className="text-xs text-slate-400">
                            Use for premium models like Claude 4, Gemini 2.5
                            Pro, GPT-O3
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 shrink-0 text-violet-400" />
                        <div>
                          <strong className="text-white">Unlimited Standard Requests</strong>
                          <p className="text-xs text-slate-400">
                            Use for models like Gemini-2.5 Flash, GPT-4o,
                            Deepseek R1
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 shrink-0 text-violet-400" />
                        <div className="text-white">Advanced Intelligent Routing</div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 shrink-0 text-violet-400" />
                        <div className="text-white">Priority Chat Support</div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 shrink-0 text-violet-400" />
                        <div className="text-white">API Access</div>
                      </li>
                    </ul>
                  </div>
                  <Button className="mt-8 w-full" variant="outline" disabled>
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
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Built by Engineers, for Everyone
              </h2>
              <p className="mb-8 text-lg text-slate-300">
                We experienced the frustration of constantly switching between
                different AI models, never knowing which one would work best for
                our specific needs. That&apos;s why we built Mayura - to
                eliminate the guesswork and deliver the right AI solution every
                time.
              </p>
              <p className="text-slate-300">
                Our mission is to democratize access to the world&apos;s best AI
                models through intelligent routing, making advanced AI
                capabilities accessible to individuals, startups, and
                enterprises alike.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="mx-auto max-w-3xl">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-slate-700 last:border-b-0"
                >
                  <button
                    className="flex w-full items-center justify-between py-6 text-left"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-semibold text-white">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="size-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="size-5 text-slate-400" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="pb-6">
                      <p className="text-slate-300">{faq.answer}</p>
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
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Ready to Transform Your AI Workflow?
              </h2>
              <p className="mb-8 text-lg text-slate-300">
                Join our beta and start upgrading your AI experience with Mayura
                today.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="bg-violet-600 text-white hover:bg-violet-700">
                  <Link href="/login">
                    <Zap className="mr-2 size-5" /> Get Started Free
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-violet-600 text-violet-400 hover:bg-violet-900/20">
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
      <footer className="w-full border-t border-slate-700 bg-black/30 py-12 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded bg-violet-600 p-2">
                  <p className="font-bold text-white">M</p>
                </div>
                <h3 className="font-bold text-white">Mayura</h3>
              </div>
              <p className="mb-4 text-sm text-slate-300">
                Intelligent AI routing for superior results, every time.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">Product</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  <Link href="#features" className="hover:text-violet-400 hover:underline">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-violet-400 hover:underline">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-violet-400 hover:underline">
                    API Docs
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:text-violet-400 hover:underline">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">Company</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  <Link href="/about" className="hover:text-violet-400 hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-violet-400 hover:underline">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-violet-400 hover:underline">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-violet-400 hover:underline">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">Support</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  <Link href="/help" className="hover:text-violet-400 hover:underline">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-violet-400 hover:underline">
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-violet-400 hover:underline">
                    Status
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-violet-400 hover:underline">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between border-t border-slate-700 pt-8 sm:flex-row">
            <p className="text-xs text-slate-400">
              © 2025 Mayura. All rights reserved. Currently in Beta.
            </p>
            <nav className="mt-4 flex gap-6 sm:mt-0">
              <Link
                href="/privacy"
                className="text-xs text-slate-400 hover:text-violet-400 hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-slate-400 hover:text-violet-400 hover:underline"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-xs text-slate-400 hover:text-violet-400 hover:underline"
              >
                Cookie Policy
              </Link>
            </nav>
          </div>
        </div>
      </footer>

      {/* Big MAYURA Footer */}
      {/* <div className="relative w-full overflow-hidden py-28 flex items-end justify-center bg-black/30 backdrop-blur-sm">
        <h1 className="text-[12rem] md:text-[16rem] lg:text-[22rem] xl:text-[28rem] tracking-[.2em] bg-gradient-to-b from-white via-slate-400 via-30% to-black to-60% bg-clip-text text-transparent select-none pointer-events-none leading-none">
          M A Y U R A
        </h1>
      </div> */}
    </div>
  )
}
