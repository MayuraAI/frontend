"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ArrowRight,
  Brain,
  Rocket,
  Zap,
  CheckCircle,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  DollarSign as DollarSignIcon,
  MessageSquare,
  Route,
  Send
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { AIRoutingAnimation } from "@/components/hero/ai-routing-animation"
import { signInAnonymouslyUser, isAnonymousUser } from "@/lib/firebase/auth"

const FREE_PROMPTS_COUNT = 5

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [heroPrompt, setHeroPrompt] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { user, loading } = useAuth()

  // Don't auto-redirect - let users choose their path

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const handleTryWithFreeRequests = async () => {
    try {
      await signInAnonymouslyUser()
      router.push("/chat")
    } catch (error) {
      console.error("Error signing in anonymously:", error)
    }
  }

  const handleHeroPromptSubmit = async (e?: React.FormEvent, promptText?: string) => {
    if (e) {
      e.preventDefault()
    }
    
    const promptToSubmit = samplePromptsMap[promptText as keyof typeof samplePromptsMap] || heroPrompt.trim()
    if (!promptToSubmit || isSubmitting) return

    setIsSubmitting(true)
    try {
      // Store the prompt in localStorage to be picked up by the chat page
      localStorage.setItem('heroPrompt', promptToSubmit)
      
      // Navigate to chat
      router.push("/chat")
    } catch (error) {
      console.error("Error handling hero prompt:", error)
    } finally {
      setIsSubmitting(false)
    }
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
        "The Free tier includes access to high-quality models including Llama 3.3 70B, DeepSeek R1, Qwen 3 32B, Gemma 2 9B, and more. You get unlimited access to these standard models plus 10 Pro requests daily for premium models."
    },
    {
      question: "What premium models are available with Pro requests?",
      answer:
        "Pro requests give you access to the most powerful models like Gemini 2.5 Pro Preview, Gemini 2.5 Flash Preview, Gemini 2.0 Flash, Gemini 2.0 Flash Lite, and Gemini 1.5 Pro. These are perfect for complex reasoning, advanced coding, and critical tasks."
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

  const samplePromptsMap = {
    "Debug my code": `
    Debug my code

    def say_hello():
      print("Hello" + name + ", Welcome to Mayura!")
    `,
    "Create a website": `
    Create a beautiful landing page for a chatbot using html and css.
    `,
    "Write an email": `
    Write an email to the devs of Mayura to appreciate their product.
    `,
    "Explain a concept": `
    Explain a concept of prompt routing.
    `
  }

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <header className="flex w-full items-center justify-between border-b border-slate-700 bg-transparent p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <img 
                  src="/logo_512.png" 
                  alt="Mayura Logo" 
                  className="size-8 md:size-10 lg:size-12"
                />
                <p
            className="text-sidebar-foreground flex-1 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
          >
            Mayura 
          </p>
            <span className="ml-1 align-top text-base font-semibold opacity-60">(beta)</span>
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
          {!loading && user && !isAnonymousUser() ? (
            // Authenticated user - show Go to Chat
            <Button onClick={() => router.push("/chat")} className="bg-violet-600 text-white hover:bg-violet-700">
              Go to Chat <ArrowRight className="ml-2 size-4" />
            </Button>
          ) : (
            // Anonymous or no user - show Try Free Requests
            <Button onClick={() => router.push("/login")} className="bg-violet-600 text-white hover:bg-violet-700">
              Sign In<ArrowRight className="ml-2 size-4" />
            </Button>
          )}
        </div>
        </nav>
      </header>

      <main className="w-full flex-1">
        {/* Hero Section */}
        <section className="w-full px-6 py-24 md:py-32 lg:py-40">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-center lg:gap-24">
              {/* Left: Hero Content */}
              <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
                {/* Main Headline */}
                <h1 className="mb-6 text-4xl font-medium text-white sm:text-5xl lg:text-6xl xl:text-7xl leading-tight tracking-tight">
                  What do you want to ask?
                  <br />
                  <span className="bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">We&apos;ll route it to the best AI.</span>
                </h1>

                {/* Input Section */}
                <div className="w-full max-w-xl mb-8">
                  {!loading && user && !isAnonymousUser() ? (
                    // Authenticated user - show Go to Chat
                    <Button 
                      size="lg" 
                      onClick={() => router.push("/chat")} 
                      className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium text-lg py-4 h-auto rounded-xl"
                    >
                      Go to Chat
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      {/* Label */}
                      <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-4">
                          <Zap className="size-4 text-green-400" />
                          <span className="text-sm font-medium text-green-300">
                            Try now • <span className="font-bold uppercase">No signup required</span>
                          </span>
                        </div>
                      </div>

                      {/* Input Form */}
                      <form onSubmit={handleHeroPromptSubmit} className="relative">
                        <div className="relative group">
                          {/* Gradient Border Effect */}
                          <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                          
                          {/* Input Container */}
                          <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-600/50 shadow-xl">
                            <Input
                              value={heroPrompt}
                              onChange={(e) => setHeroPrompt(e.target.value)}
                              placeholder="Type your idea and we will bring it to life"
                              className="w-full bg-transparent border-0 text-white placeholder:text-slate-400 text-lg py-8 px-8 pr-20 rounded-2xl focus:ring-0 h-auto"
                              disabled={isSubmitting}
                            />
                            <Button 
                              type="submit" 
                              disabled={!heroPrompt.trim() || isSubmitting}
                              className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium px-4 py-3 rounded-xl h-auto disabled:opacity-50 transition-all duration-200"
                            >
                              {isSubmitting ? (
                                <div className="flex items-center">
                                  <div className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                                </div>
                              ) : (
                                <ArrowRight className="size-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </form>

                      {/* Sample Prompts */}
                      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                        {[
                          "Debug my code",
                          "Create a website",
                          "Write an email",
                          "Explain a concept"
                        ].map((prompt, index) => (
                          <button
                            key={index}
                            onClick={() => handleHeroPromptSubmit(undefined, prompt)}
                            className="px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors border border-slate-700 rounded-full hover:border-slate-600"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Animation */}
              <div className="flex flex-1 items-center justify-center lg:justify-end scale-110">
                <div className="w-full max-w-md">
                  <AIRoutingAnimation />
                </div>
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
              <Card className="flex flex-col items-center border-slate-700 bg-black/10 p-6 text-center shadow-sm backdrop-blur-sm">
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
              <Card className="flex flex-col items-center border-slate-700 bg-black/10 p-6 text-center shadow-sm backdrop-blur-sm">
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
              <Card className="flex flex-col items-center border-slate-700 bg-black/10 p-6 text-center shadow-sm backdrop-blur-sm">
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
              <Card className="border-slate-700 bg-black/10 shadow-sm backdrop-blur-sm">
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
              <Card className="border-slate-700 bg-black/10 shadow-sm backdrop-blur-sm">
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
              <Card className="border-slate-700 bg-black/10 shadow-sm backdrop-blur-sm">
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
              <Card className="border-slate-700 bg-black/10 shadow-sm backdrop-blur-sm">
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
              <Card className="border-slate-700 bg-black/10 shadow-sm backdrop-blur-sm">
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
              <Card className="border-slate-700 bg-black/10 shadow-sm backdrop-blur-sm">
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

        {/* Beta Notice Section */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-4xl">
              <div className="rounded-lg border border-amber-600/30 bg-amber-900/10 p-6 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <div className="flex size-8 items-center justify-center rounded-full bg-amber-600/20">
                      <span className="text-sm font-bold text-amber-400">β</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-amber-200">
                      Beta Version Notice
                    </h3>
                    <p className="mb-4 text-slate-300">
                      Mayura is currently in public beta. While we&apos;ve worked hard to make it as stable as possible, 
                      you might encounter occasional bugs or unexpected behavior. Your feedback is invaluable in helping 
                      us improve the platform.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <p className="text-sm text-slate-400">
                        Found a bug or have suggestions?
                      </p>
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=pavanmanishd@gmail.com&su=Mayura%20Beta%20Feedback"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-amber-400 hover:text-amber-300 hover:underline"
                      >
                        Report to us
                      </a>
                    </div>
                  </div>
                </div>
              </div>
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
              <Card className="flex h-full flex-col border-slate-700 bg-black/10 shadow-sm backdrop-blur-sm">
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
                            Access to models including Llama 3.3 70B, DeepSeek R1, Qwen 3 32B, Gemma 2 9B
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
              <Card className="relative flex h-full flex-col border-2 border-slate-600 bg-black/10 opacity-80 shadow-sm backdrop-blur-sm">
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
                            Access to premium models
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
                  <Button className="mt-8 w-full cursor-not-allowed bg-slate-600 text-slate-300" disabled>
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
              Many Models. One Platform. Zero Hassle.
              </h2>
              <p className="mb-2 text-lg text-slate-300">
                Jumping from one AI platform to another is a pain. <br />
                We know your problem, we faced it too, that&apos;s why we built Mayura.
              </p>
              {/* <p className="text-slate-300">
                We just want to make your life easier and some money :P.
              </p> */}
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

      <footer className="w-full border-t border-slate-700 bg-transparent py-12 backdrop-blur-sm">
  <div className="container mx-auto space-y-16 px-6">
    
    {/* Row 1: Branding + Navigation */}
    <div className="mb-6 flex flex-row items-start justify-between gap-6 lg:flex-row lg:items-center">
      
      {/* Branding and Subline */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <div className="rounded bg-violet-600 p-2">
            <p className="font-bold text-white">M</p>
          </div>
          <h3 className="text-lg font-bold text-white">Mayura</h3>
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
          <p className="font-bold text-slate-300">Pavan Manish</p>
          <div className="flex gap-4 text-xs">
            <a
              href="https://x.com/fromleg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 hover:underline"
            >
              X
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=pavanmanishd@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 hover:underline"
            >
              Email
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
          <p className="font-bold text-slate-300">Sai Vishal</p>
          <div className="flex gap-4 text-xs">
            <a
              href="https://x.com/lahsiv_ias"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 hover:underline"
            >
              X
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=saivishalradham@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 hover:underline"
            >
              Email
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
