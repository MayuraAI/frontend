"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Zap, Brain, Code, FileText, Image } from "lucide-react"

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
    text: "Analyze this business proposal for key insights",
    targetModel: "claude",
    description: "Document Analysis",
    icon: FileText
  },
  {
    text: "Describe what's happening in this image",
    targetModel: "gemini",
    description: "Vision Understanding",
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

  // SVG arrow positions for each model
  // [GPT-4, Claude, Gemini, CodeLlama]
  const arrowPaths = [
    "M 140 60 C 140 100, 40 120, 40 180", // GPT-4 (left)
    "M 140 60 C 140 100, 240 120, 240 180", // Claude (right)
    "M 140 60 C 140 120, 40 200, 140 260", // Gemini (bottom left)
    "M 140 60 C 140 120, 240 200, 140 260" // CodeLlama (bottom right)
  ]

  return (
    <div className="relative w-full max-w-sm mx-auto min-h-[420px] flex flex-col items-center justify-center">
      {/* Prompt */}
      <div className="z-20 mb-6">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-violet-700/80 to-purple-900/80 shadow-2xl shadow-violet-900/30">
          <CardContent className="p-4 flex items-center gap-2">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center shadow-lg">
              <PromptIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-base leading-relaxed mb-1">"{currentPrompt.text}"</p>
              <Badge variant="secondary" className="bg-violet-900/30 text-violet-300 border-violet-600 text-xs px-2 py-1">{currentPrompt.description}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* SVG Arrows */}
      <svg
        className="absolute left-1/2 top-[90px] -translate-x-1/2 z-10 pointer-events-none"
        width={280}
        height={220}
        viewBox="0 0 280 300"
        fill="none"
        style={{ filter: 'drop-shadow(0 0 8px #a78bfa66)' }}
      >
        {aiModels.map((model, i) => (
          <path
            key={model.id}
            d={arrowPaths[i]}
            stroke={selectedModel === model.id ? model.arrowColor : '#64748b'}
            strokeWidth={selectedModel === model.id ? 3 : 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('transition-all duration-700', selectedModel === model.id && 'filter drop-shadow-lg')}
            style={{
              opacity: showArrows ? 1 : 0.15,
              filter: selectedModel === model.id ? `drop-shadow(0 0 8px ${model.arrowColor}99)` : undefined
            }}
          />
        ))}
      </svg>
      {/* Router */}
      <div className="z-20 relative mb-8">
        <div
          className={cn(
            "mx-auto bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl px-6 py-4 border-0 shadow-2xl flex items-center gap-3",
            isRouting ? "scale-105 shadow-violet-500/40" : "shadow-violet-900/20"
          )}
        >
          <span className="text-white font-semibold text-base tracking-wide">{isRouting ? "Analyzing & Routing..." : "Mayura AI Router"}</span>
          <Zap className={cn("w-5 h-5 text-white transition-all duration-300", isRouting && "animate-pulse")} />
        </div>
        {/* Glow effect */}
        {isRouting && (
          <div className="absolute inset-0 rounded-2xl bg-violet-500/20 blur-xl animate-pulse pointer-events-none" />
        )}
      </div>
      {/* Models Grid */}
      <div className="relative z-20 grid grid-cols-2 gap-6 mt-4" style={{ minWidth: 220 }}>
        {aiModels.map((model, i) => {
          const ModelIcon = model.icon
          const isSelected = selectedModel === model.id
          const isRouting_Local = isRouting && !selectedModel
          return (
            <Card
              key={model.id}
              className={cn(
                "relative overflow-hidden transition-all duration-700 border-0",
                isSelected
                  ? `bg-gradient-to-br ${model.color} shadow-2xl scale-105 z-10` // Glow and scale
                  : isRouting_Local
                  ? "bg-slate-800/60 scale-95 opacity-70"
                  : "bg-slate-800/90 hover:scale-105"
              )}
              style={{ transitionDelay: `${i * 100}ms`, minWidth: 100 }}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                    isSelected ? "bg-white/20 backdrop-blur-sm shadow-lg" : "bg-slate-700"
                  )}
                >
                  <ModelIcon className={cn("w-5 h-5 transition-colors duration-500", isSelected ? "text-white" : "text-slate-300")}/>
                </div>
                <div className="flex-1">
                  <h3 className={cn("font-bold text-base transition-colors duration-500", isSelected ? "text-white" : "text-slate-200")}>{model.name}</h3>
                  <p className={cn("text-xs transition-colors duration-500", isSelected ? "text-white/80" : "text-slate-400")}>{model.specialty}</p>
                </div>
                {isSelected && (
                  <div className="w-3 h-3 rounded-full bg-white animate-pulse shadow-lg" />
                )}
              </CardContent>
              {/* Selected model glow effect */}
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              )}
            </Card>
          )
        })}
      </div>
      {/* Result Indicator */}
      <div className="mt-6 text-center z-30">
        <div
          className={cn(
            "inline-flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-700 border-0 shadow-xl text-base",
            selectedModel
              ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/30"
              : isRouting
              ? "bg-gradient-to-r from-violet-600 to-purple-600 shadow-violet-500/30"
              : "bg-slate-800/90"
          )}
        >
          <div
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              selectedModel
                ? "bg-white animate-pulse"
                : isRouting
                ? "bg-white animate-spin"
                : "bg-slate-400"
            )}
          ></div>
          <span
            className={cn(
              "font-semibold transition-colors duration-300",
              selectedModel || isRouting ? "text-white" : "text-slate-300"
            )}
          >
            {selectedModel
              ? `✨ Routed to ${selectedModelData?.name}!`
              : isRouting
              ? "🔍 Finding Perfect Match..."
              : "⚡ Ready to Route"}
          </span>
        </div>
      </div>
    </div>
  )
} 