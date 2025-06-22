"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Brain, Code, Zap } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-slate-900 to-black">
      {/* Header */}
      <header className="flex w-full items-center justify-between border-b border-slate-700 bg-black/20 p-6 shadow-sm backdrop-blur-sm">
        <a href="/">
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
        </a>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="border-violet-600 text-violet-400 hover:bg-violet-900/20">
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" /> Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="w-full flex-1">
        {/* Hero Section */}
        <section className="w-full px-6 py-16 md:py-24">
          <div className="container mx-auto">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                Built by Engineers, for Everyone
              </h1>
              <p className="mb-8 text-xl text-slate-300">
                We know your problem bro, we faced it too, that's why we built Mayura.
              </p>
              <p className="text-lg text-slate-400">
                We just want to make your life easier and some money :P
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-4xl">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Our Story
                </h2>
              </div>
              
              <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
                <Card className="border-slate-700 bg-black/30 shadow-sm backdrop-blur-sm">
                  <CardHeader>
                    <Brain className="mb-2 size-8 text-violet-400" />
                    <CardTitle className="text-white">The Problem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300">
                      Constantly switching between different AI models, never knowing which one would work best for specific tasks. The frustration was real.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-slate-700 bg-black/30 shadow-sm backdrop-blur-sm">
                  <CardHeader>
                    <Code className="mb-2 size-8 text-violet-400" />
                    <CardTitle className="text-white">The Solution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300">
                      We built Mayura to eliminate the guesswork. One prompt, intelligent routing, perfect results every time.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-slate-700 bg-black/30 shadow-sm backdrop-blur-sm">
                  <CardHeader>
                    <Zap className="mb-2 size-8 text-violet-400" />
                    <CardTitle className="text-white">The Mission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300">
                      Make advanced AI accessible to everyone through intelligent routing. Less complexity, better results.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-16 text-center">
                <div className="mx-auto max-w-3xl rounded-lg border border-slate-700 bg-black/20 p-8 backdrop-blur-sm">
                  <h3 className="mb-4 text-2xl font-bold text-white">
                    Why Mayura?
                  </h3>
                  <p className="mb-6 text-lg text-slate-300">
                    We experienced the pain of juggling multiple AI platforms. Mayura is our answer to that chaos.
                  </p>
                  <p className="text-slate-400">
                    Built with love, caffeine, and a genuine desire to solve a problem we all face. 
                    Currently in beta, constantly improving, and yes - we're trying to make some money while making your life easier.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Ready to Try Mayura?
              </h2>
              <p className="mb-8 text-lg text-slate-300">
                Join our beta and experience intelligent AI routing today.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="bg-violet-600 text-white hover:bg-violet-700">
                  <Link href="/chat">
                    <Zap className="mr-2 size-5" /> Try Mayura Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-violet-600 text-violet-400 hover:bg-violet-900/20">
                  <Link href="/">
                    <ArrowLeft className="mr-2 size-5" /> Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 