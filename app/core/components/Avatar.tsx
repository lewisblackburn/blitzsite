import cn from "classnames"
import { useMemo } from "react"

function randomColour(text: string): string {
  const colours = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-teal-500",
    "bg-blue-500",
    "bg-indigo-500",
  ]

  const hash = (str: string): number => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    return hash % colours.length
  }

  const colour = colours[hash(text)] || "bg-gray-500"

  return colour
}

function getInitials(text: string): string {
  const words = text.split(" ")
  const initials = words.map((word) => word[0]).join("")

  return initials
}

export default function Avatar({ text }: { text: string }) {
  const colour = useMemo(() => randomColour(text), [text])

  return (
    <div
      className={cn(
        "grid place-items-center w-10 h-10 rounded-full text-xs tracking-wide font-bold bg-black",
        colour
      )}
    >
      {getInitials(text)}
    </div>
  )
}
