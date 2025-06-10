"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="bg-background flex size-full flex-col items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center space-y-6 p-8 text-center">
          <div className="space-y-2">
            <h1 className="text-foreground text-4xl font-bold tracking-tight">
              Mayura AI
            </h1>
            <p className="text-muted-foreground">Chat with AI</p>
          </div>

          <Button asChild className="w-full gap-2">
            <Link href="/login">
              Get Started
              <ArrowRight size={16} />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
