import { IconType } from "react-icons"

interface IconProps {
  icon: IconType
  className?: string
}

export const Icon: React.FC<IconProps> = ({ icon, className }) => {
  return <div className="hover:bg-accent p-1 rounded-md">{icon({ className })}</div>
}

export default Icon
