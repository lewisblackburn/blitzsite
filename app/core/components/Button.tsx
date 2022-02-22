import React from "react"
import cn from "classnames"

export type IButton = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export const Button: React.FC<IButton> = ({ children, className, ...props }) => {
  return (
    <button
      className={cn(
        "p-2 border border-gray-600 bg-gray-900 hover:bg-gray-800 leading-none text-xs text-center font-semibold rounded transform transition-all",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
