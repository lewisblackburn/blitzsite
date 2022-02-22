import React from "react"
import cn from "classnames"
import Button, { IButton } from "./Button"
import { IconType } from "react-icons"
import Icon from "./Icon"
import Spinner from "./Spinner"

interface IconButton extends IButton {
  icon: IconType
  loading?: boolean
}

export const IconButton: React.FC<IconButton> = ({
  icon,
  loading,
  children,
  className,
  ...props
}) => {
  return (
    <Button className={cn("flex items-center space-x-1 text-center", className)} {...props}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Icon icon={icon} />
          <div className="text-white ml-1">{children}</div>
        </>
      )}
    </Button>
  )
}

export default IconButton
