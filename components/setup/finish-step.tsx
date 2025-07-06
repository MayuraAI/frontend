import { FC } from "react"

interface FinishStepProps {
  displayName: string
}

export const FinishStep: FC<FinishStepProps> = ({ displayName }) => {
  return (
    <div className="space-y-6 text-center">
      <div className="text-lg sm:text-xl font-medium">
        Welcome to Mayura
        {displayName.length > 0 ? `, ${displayName.split(" ")[0]}` : null}!
      </div>

      <div className="text-sm sm:text-base text-muted-foreground">
        Click next to start chatting.
      </div>
    </div>
  )
}
