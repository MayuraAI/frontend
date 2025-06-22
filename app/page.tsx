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
      question: "What models are available in the Free tier?",
      answer:
        "The Free tier includes access to 25+ high-quality models including Llama 3.3 70B, DeepSeek R1, Qwen 3 235B, Phi-4 Reasoning, and many more. You get unlimited access to these standard models plus 10 Pro requests daily for premium models."
    },
    {
      question: "What premium models are available with Pro requests?",
      answer:
        "Pro requests give you access to the most powerful models like Gemini 2.5 Pro, Gemini 2.5 Flash Preview, Gemini 2.0 Flash, and other cutting-edge models. These are perfect for complex reasoning, advanced coding, and critical tasks."
    },
    {
      question: "Can I choose which model to use?",
      answer:
        "In the Free tier, Mayura automatically routes your prompts to the best model. With the Pro plan (coming soon), you'll have the option to manually select specific models while still benefiting from intelligent auto-routing when preferred."
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
      question: "What's the difference between Standard and Pro requests?",
      answer:
        "Standard requests use reliable, fast models perfect for everyday tasks like coding, writing, and analysis. Pro requests access the most advanced models available for complex reasoning, research, and critical work requiring the highest quality output."
    },
    {
      question: "Is this a limited beta?",
      answer:
        "Yes, Mayura is currently in public beta. The Free tier is fully available now. The Pro tier with manual model selection and additional features will launch after the beta period."
    }
  ]

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-slate-900 to-black">
      {/* Header */}
      <header className="flex w-full items-center justify-between border-b border-slate-700 bg-black/20 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <h1
            className="flex-1 text-sidebar-foreground cursor-pointer text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight transition-opacity hover:opacity-80"
            onClick={() => (window.location.href = "/")}
          >
            Mayura <span className="text-base font-semibold opacity-60 align-top ml-1">(beta)</span>
          </h1>
              </div>
          </div>
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
        <div className="flex items-center gap-4">
          <Button asChild className="bg-violet-600 text-white hover:bg-violet-700">
            <Link href="/chat">
            Try Mayura Now <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
        </nav>
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
                    className="pb-2 relative select-text bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
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
                  <p className="mx-auto max-w-2xl text-lg text-slate-300 md:mx-0 md:text-lg lg:text-lg">
                    Shoot your prompt, we&apos;ll route your prompt.
                  </p>
                </div>
                <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                  <Button size="lg" asChild className="bg-violet-600 text-white hover:bg-violet-700">
                    <Link href="/chat">
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
                Get the right AI model in three simple steps.
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
                    1. Send Your Prompt
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300">
                  <p>
                    Just give us your prompt. <br /> We&apos;ll handle the rest.
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
                      __html: "2. Smart Routing"
                    }}
                  />
                </CardHeader>
                <CardContent className="text-slate-300">
                  <p>
                    Our complex classification system routes your prompt to the best model.
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
                    3. Perfect Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300">
                  <p>
                    Voila! <br /> Best response from the best model.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section className="w-full py-16 md:py-24" id="features">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Why Mayura?
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-300">
                Stop juggling multiple AI platforms. Get better results with less effort.
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
                            Access premium models like Gemini 2.5 Pro, Gemini 2.5 Flash Preview
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 shrink-0 text-violet-400" />
                        <div>
                          <strong className="text-white">Unlimited Standard Requests</strong>
                          <p className="text-xs text-slate-400">
                            25+ models including Llama 3.3 70B, DeepSeek R1, Qwen 3 235B, Phi-4
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 shrink-0 text-violet-400" />
                        <div className="text-white">Intelligent Auto-Routing Only</div>
                      </li>
                    </ul>
                  </div>
                  <Button className="mt-8 w-full bg-violet-600 text-white hover:bg-violet-700" asChild>
                    <Link href="/chat">Try Mayura Now</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="relative flex h-full flex-col border-2 border-slate-600 bg-black/20 shadow-sm backdrop-blur-sm opacity-80">
                <div className="absolute -top-4 left-1/2 w-fit -translate-x-1/2 rounded-full bg-slate-600 px-4 py-1 text-sm font-medium text-slate-300">
                  Coming Soon
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-300">Pro</h3>
                    <div className="w-fit rounded-full border border-slate-600 bg-slate-800/20 px-3 py-1 text-xs font-medium text-slate-400">
                      After Beta
                    </div>
                  </div>
                  <p className="pt-2 text-sm text-slate-500">
                    For professionals who need full control and unlimited access.
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-slate-300">$xx</span>
                      <span className="text-lg font-medium text-slate-500">
                        /month
                      </span>
                    </div>
                    <p className="mb-4 font-semibold text-slate-400">
                      Everything in Free, plus:
                    </p>
                    <ul className="space-y-4 text-sm">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 shrink-0 text-slate-500" />
                        <div>
                          <strong className="text-slate-300">100 Pro Requests / day</strong>
                          <p className="text-xs text-slate-500">
                            Unlimited access to premium models
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 shrink-0 text-slate-500" />
                        <div>
                          <strong className="text-slate-300">Manual Model Selection</strong>
                          <p className="text-xs text-slate-500">
                            Choose specific models or use auto-routing
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 shrink-0 text-slate-500" />
                        <div className="text-slate-300">Priority Support</div>
                      </li>
                      {/* <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 shrink-0 text-slate-500" />
                        <div className="text-slate-300">API Access</div>
                      </li> */}
                      {/* <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 shrink-0 text-slate-500" />
                        <div className="text-slate-300">Usage Analytics</div>
                      </li> */}
                    </ul>
                  </div>
                  <Button className="mt-8 w-full bg-slate-600 text-slate-300 cursor-not-allowed" disabled>
                    Coming After Beta
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
              <p className="mb-2 text-lg text-slate-300">
                We know your problem bro, we faced it too, that&apos;s why we built Mayura.
              </p>
              <p className="text-slate-300">
                We just want to make your life easier and some money :P.
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

      <footer className="w-full border-t border-slate-700 bg-black/30 py-12 backdrop-blur-sm">
  <div className="container mx-auto px-6 space-y-16">
    
    {/* Row 1: Branding + Navigation */}
    <div className="flex flex-row lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
      
      {/* Branding and Subline */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="rounded bg-violet-600 p-2">
            <p className="font-bold text-white">M</p>
          </div>
          <h3 className="font-bold text-white text-lg">Mayura</h3>
        </div>
        <p className="text-sm text-slate-300">
          Intelligent AI routing for superior results, every time.
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-row gap-6">
        <Link href="#features" className="text-sm text-slate-300 hover:text-violet-400 hover:underline">
          Features
        </Link>
        <Link href="#pricing" className="text-sm text-slate-300 hover:text-violet-400 hover:underline">
          Pricing
        </Link>
        <Link href="/about" className="text-sm text-slate-300 hover:text-violet-400 hover:underline">
          About Us
        </Link>
      </div>
    </div>

    {/* Row 2: Contact Info */}
    <div className="text-sm text-slate-400">
      <p className="mb-2">Contact us:</p>
      <div className="flex flex-row gap-12">
        {/* Pavan Manish */}
        <div className="flex flex-col gap-1">
          <p className="text-slate-300 font-bold">Pavan Manish</p>
          <div className="flex gap-4 text-xs">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=pavanmanishd@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 hover:underline"
            >
              Email
            </a>
            <a
              href="https://linkedin.com/in/pavanmanishd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 hover:underline"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/pavanmanishd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Sai Vishal */}
        <div className="flex flex-col gap-1">
          <p className="text-slate-300 font-bold">Sai Vishal</p>
          <div className="flex gap-4 text-xs">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=saivishalradham@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 hover:underline"
            >
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/vishalsai010304/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 hover:underline"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/Vishal0129"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
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
