import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { FC, useRef } from "react"

export const SETUP_STEP_COUNT = 2

interface StepContainerProps {
  stepDescription: string
  stepNum: number
  stepTitle: string
  onShouldProceed: (shouldProceed: boolean) => void
  children?: React.ReactNode
  showBackButton?: boolean
  showNextButton?: boolean
}

export const StepContainer: FC<StepContainerProps> = ({
  stepDescription,
  stepNum,
  stepTitle,
  onShouldProceed,
  children,
  showBackButton = false,
  showNextButton = true
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey && showNextButton) {
      if (buttonRef.current) {
        buttonRef.current.click()
      }
    }
  }

  return (
    <Card
      className="max-h-[calc(100vh-60px)] w-full max-w-[600px] overflow-auto"
      onKeyDown={handleKeyDown}
    >
      <CardHeader className="space-y-3 pb-4">
        <CardTitle className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
          <div className="text-lg sm:text-xl">{stepTitle}</div>

          <div className="text-sm text-muted-foreground">
            {stepNum} / {SETUP_STEP_COUNT}
          </div>
        </CardTitle>

        <CardDescription className="text-sm sm:text-base">{stepDescription}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-4 sm:px-6">{children}</CardContent>

      <CardFooter className="flex flex-col space-y-3 px-4 pt-4 sm:flex-row sm:justify-between sm:space-y-0 sm:px-6">
        <div className="w-full sm:w-auto">
          {showBackButton && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onShouldProceed(false)}
              className="w-full sm:w-auto"
            >
              Back
            </Button>
          )}
        </div>

        <div className="w-full sm:w-auto">
          <Button
            ref={buttonRef}
            size="sm"
            onClick={() => onShouldProceed(true)}
            disabled={!showNextButton}
            className={`w-full sm:w-auto transition-all duration-200 ${
              showNextButton 
                ? "bg-violet-600 hover:bg-violet-700 text-white shadow-md hover:shadow-lg" 
                : "bg-slate-800 text-slate-400 cursor-not-allowed opacity-60 hover:bg-slate-800"
            }`}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
