"use client"

import { FC } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MayuraSVG } from "../icons/mayura-svg"

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
      <MayuraSVG scale={0.3} />
      <div className="font-bold text-xl">Mayura AI</div>
    </Link>
  )
}
