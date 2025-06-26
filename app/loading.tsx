import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="bg-background flex min-h-screen size-full items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center space-y-4 p-8">
          <Loader2 className="text-primary size-8 animate-spin" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </CardContent>
      </Card>
    </div>
  )
}
