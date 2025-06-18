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
      question: "Is there a free trial?",
      answer:
        "Yes! We offer a free tier with 100 prompts per month. No credit card required to get started."
    },
    {
      question: "What's the pricing model?",
      answer:
        "We use a simple pay-per-prompt model with transparent pricing. You only pay for successful prompt routing, with volume discounts available for higher usage tiers."
    }
  ]

  return (
    <div className="flex w-full max-w-7xl flex-col items-center justify-center">
      {/* Header */}
      <header className="flex w-full items-center justify-between border-b p-6">
        <div className="flex items-center gap-2">
          <div className="rounded bg-black p-2">
            <p className="font-bold text-white">M</p>
          </div>
          <h1 className="text-xl font-bold">Mayura</h1>
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
          {" "}
          {/* Changed background for consistency */}
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
              {" "}
              {/* Adjusted gap and removed absolute positioning for simpler styling */}
              {/* Step 1 */}
              <Card className="flex flex-col items-center p-6 text-center">
                {" "}
                {/* Using Card component */}
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

            {/* Example Use Cases */}
            {/* <div className="mt-20 text-center">
              <h4 className="font-bold text-2xl mb-6 text-zinc-800">See Mayura in Action!</h4>
              <div className="grid md:grid-cols-3 gap-6 text-base bg-white p-8 rounded-xl shadow-md max-w-4xl mx-auto">
                <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-3">
                  <Code className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <p className="text-zinc-700"><strong>Coding Challenge:</strong> Routed to a specialized code-generating LLM.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-purple-600 flex-shrink-0" />
                  <p className="text-zinc-700"><strong>Market Analysis:</strong> Directed to an analytical reasoning model.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg flex items-center gap-3">
                  <Zap className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <p className="text-zinc-700"><strong>Creative Writing:</strong> Sent to an imaginative content creation AI.</p>
                </div>
              </div>
            </div> */}
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

        {/* Pricing Section */}
        <section id="pricing" className="w-full bg-zinc-50 py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-zinc-600">
                Pay only for what you use. No hidden fees, no surprises.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <div className="text-3xl font-bold">
                    $0
                    <span className="text-base font-normal text-zinc-500">
                      /month
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="mb-6 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="size-4 text-green-500" />
                      <span className="text-sm">100 prompts/month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="size-4 text-green-500" />
                      <span className="text-sm">Basic model routing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="size-4 text-green-500" />
                      <span className="text-sm">Community support</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-primary">
                <CardHeader>
                  <div className="bg-primary text-primary-foreground w-fit rounded-full px-2 py-1 text-xs">
                    Most Popular
                  </div>
                  <CardTitle>Pro</CardTitle>
                  <div className="text-3xl font-bold">
                    $29
                    <span className="text-base font-normal text-zinc-500">
                      /month
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="mb-6 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="size-4 text-green-500" />
                      <span className="text-sm">5,000 prompts/month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="size-4 text-green-500" />
                      <span className="text-sm">Advanced routing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="size-4 text-green-500" />
                      <span className="text-sm">Usage analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="size-4 text-green-500" />
                      <span className="text-sm">Priority support</span>
                    </li>
                  </ul>
                  <Button className="w-full">Start Free Trial</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <div className="text-3xl font-bold">Custom</div>
                </CardHeader>
                <CardContent>
                  <ul className="mb-6 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="size-4 text-green-500" />
                      <span className="text-sm">Unlimited prompts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="size-4 text-green-500" />
                      <span className="text-sm">Custom model routing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="size-4 text-green-500" />
                      <span className="text-sm">Advanced analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="size-4 text-green-500" />
                      <span className="text-sm">Dedicated support</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

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
                Join thousands of users who have already upgraded their AI
                experience with Mayura.
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
              © 2025 Mayura. All rights reserved.
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
