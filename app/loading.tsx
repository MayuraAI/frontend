import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center space-y-4 p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    </div>
  )
}
