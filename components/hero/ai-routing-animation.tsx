"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Zap, Brain, Code, FileText, Image, UserIcon } from "lucide-react"

interface AIModel {
  id: string
  name: string
  color: string
  specialty: string
  icon: any
  arrowColor: string
}

interface PromptExample {
  text: string
  targetModel: string
  description: string
  icon: any
}

const aiModels: AIModel[] = [
  {
    id: "gpt4",
    name: "GPT-4",
    color: "from-green-400 to-green-600",
    specialty: "General Intelligence",
    icon: Brain,
    arrowColor: "#34d399"
  },
  {
    id: "claude",
    name: "Claude",
    color: "from-orange-400 to-orange-600",
    specialty: "Analysis & Writing",
    icon: FileText,
    arrowColor: "#fb923c"
  },
  {
    id: "gemini",
    name: "Gemini",
    color: "from-blue-400 to-blue-600",
    specialty: "Multimodal Tasks",
    icon: Image,
    arrowColor: "#60a5fa"
  },
  {
    id: "codellama",
    name: "CodeLlama",
    color: "from-purple-400 to-purple-600",
    specialty: "Code Generation",
    icon: Code,
    arrowColor: "#a78bfa"
  }
]

const promptExamples: PromptExample[] = [
  {
    text: "Write a Python function to sort a list",
    targetModel: "codellama",
    description: "Code Generation",
    icon: Code
  },
  {
    text: "Analyze this proposal for key insights",
    targetModel: "claude",
    description: "Analysis",
    icon: FileText
  },
  {
    text: "What is the weather in Tokyo?",
    targetModel: "gemini",
    description: "Conversation",
    icon: Image
  },
  {
    text: "Help me plan a 2-week vacation to Japan",
    targetModel: "gpt4",
    description: "Complex Planning",
    icon: Brain
  }
]

export function AIRoutingAnimation() {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [isRouting, setIsRouting] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [showArrows, setShowArrows] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRouting(false)
      setSelectedModel(null)
      setShowArrows(false)
      setTimeout(() => {
        setIsRouting(true)
        setShowArrows(true)
        setTimeout(() => {
          const currentPrompt = promptExamples[currentPromptIndex]
          setSelectedModel(currentPrompt.targetModel)
          setTimeout(() => {
            setCurrentPromptIndex((prev) => (prev + 1) % promptExamples.length)
          }, 2000)
        }, 1000)
      }, 500)
    }, 5000)
    return () => clearInterval(interval)
  }, [currentPromptIndex])

  const currentPrompt = promptExamples[currentPromptIndex]
  const selectedModelData = aiModels.find(m => m.id === selectedModel)
  const PromptIcon = currentPrompt.icon

  return (
    <div className="relative mx-auto flex min-h-[420px] w-full max-w-sm flex-col items-center justify-center">
      {/* Prompt */}
      <div className="z-20 mb-6">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-violet-700/80 to-purple-900/80 shadow-2xl shadow-violet-900/30">
          <CardContent className="flex items-center gap-2 p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-violet-600 shadow-lg">
              <UserIcon className="size-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="mb-1 text-base font-medium leading-relaxed text-white">"{currentPrompt.text}"</p>
              {/* <Badge variant="secondary" className="border-violet-600 bg-violet-900/30 px-2 py-1 text-xs text-violet-300">{currentPrompt.description}</Badge> */}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* SVG Arrows */}
      <svg
        className="pointer-events-none absolute left-1/2 top-[200px] z-10 -translate-x-1/2"
        width={340}
        height={90}
        viewBox="0 0 340 90"
        fill="none"
        style={{ filter: 'drop-shadow(0 0 8px #a78bfa66)' }}
      >
        {/* Four arrows from prompt to each model below */}
        {[0, 1, 2, 3].map((i) => {
          // Arrow start (prompt card center bottom)
          const startX = 170;
          const startY = 10;
          // Arrow end (model card center top)
          const spacing = 80;
          const endX = 50 + i * spacing;
          const endY = 80;
          // Control points for a nice curve
          const c1X = startX;
          const c1Y = 40;
          const c2X = endX;
          const c2Y = 50;
          const model = aiModels[i];
          return (
            <path
              key={model.id}
              d={`M ${startX} ${startY} C ${c1X} ${c1Y}, ${c2X} ${c2Y}, ${endX} ${endY}`}
              stroke={selectedModel === model.id ? model.arrowColor : '#64748b'}
              strokeWidth={selectedModel === model.id ? 3 : 1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn('transition-all duration-700', selectedModel === model.id && 'drop-shadow-lg')}
              style={{
                opacity: showArrows ? 1 : 0.15,
                filter: selectedModel === model.id ? `drop-shadow(0 0 8px ${model.arrowColor}99)` : undefined
              }}
            />
          )
        })}
      </svg>
      {/* Router */}
      <div className="relative z-20 mb-8">
        <div className="flex flex-col items-center gap-3 rounded-2xl border-0 bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-4 shadow-2xl">
          <div
            className={cn(
              "flex items-center gap-3",
              isRouting ? "scale-105 shadow-violet-500/40" : "shadow-violet-900/20"
            )}
          >
            <span className="text-base font-semibold tracking-wide text-white">{"Mayura AI Router"}</span>
            <Zap className={cn("size-5 text-white transition-all duration-300", isRouting && "animate-pulse")} />
          </div>
            <Badge variant="secondary" className="border-violet-600 bg-violet-900/30 px-2 py-1 text-xs text-violet-300">{currentPrompt.description}</Badge>
        </div>
        {/* Glow effect */}
        {isRouting && (
          <div className="pointer-events-none absolute inset-0 animate-pulse rounded-2xl bg-violet-500/20 blur-xl" />
        )}
      </div>
      {/* Models Row */}
      <div className="relative z-20 mt-4 flex w-full max-w-[320px] flex-row items-end justify-between gap-2">
        {aiModels.map((model, i) => {
          const ModelIcon = model.icon
          const isSelected = selectedModel === model.id
          const isRouting_Local = isRouting && !selectedModel
          return (
            <Card
              key={model.id}
              className={cn(
                "relative overflow-hidden border-0 transition-all duration-700 w-[70px]",
                isSelected
                  ? `bg-gradient-to-br ${model.color} z-10 scale-105 shadow-2xl` // Glow and scale
                  : isRouting_Local
                  ? "scale-95 bg-slate-800/60 opacity-70"
                  : "bg-slate-800/90 hover:scale-105"
              )}
              style={{ transitionDelay: `${i * 100}ms`, minWidth: 70 }}
            >
              <CardContent className="flex flex-col items-center gap-2 p-2">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-xl transition-all duration-500",
                    isSelected ? "bg-white/20 shadow-lg backdrop-blur-sm" : "bg-slate-700"
                  )}
                >
                  <ModelIcon className={cn("size-5 transition-colors duration-500", isSelected ? "text-white" : "text-slate-300")}/>
                </div>
                <h3 className={cn("text-xs font-bold transition-colors duration-500 text-center", isSelected ? "text-white" : "text-slate-200")}>{model.name}</h3>
                <p className={cn("text-[10px] transition-colors duration-500 text-center", isSelected ? "text-white/80" : "text-slate-400")}>{model.specialty}</p>
                {isSelected && (
                  <div className="size-2 animate-pulse rounded-full bg-white shadow-lg" />
                )}
              </CardContent>
              {/* Selected model glow effect */}
              {isSelected && (
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
} 