"use client"

import { FC } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface BrandProps {
  theme?: "dark" | "light"
}

export const Brand: FC<BrandProps> = ({ theme = "dark" }) => {
  const router = useRouter()

  return (
    <Link
      href="https://www.mayura.ai"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2"
    >
      <div className="text-xl font-bold">Mayura AI</div>
    </Link>
  )
}
