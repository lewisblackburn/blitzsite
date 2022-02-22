import { Image, Link } from "blitz"
import { Playground } from "./Playground"
import { LikeButtonDemo } from "app/playgrounds/LikeButtonDemo"
import ProsCard from "./ProsCard"
import ConsCard from "./ConsCard"

const CustomLink = (props) => {
  const href = props.href
  const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"))

  if (isInternalLink) {
    return (
      <Link href={href}>
        <a {...props}>{props.children}</a>
      </Link>
    )
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function RoundedImage(props) {
  return (
    <div className="grid place-items-center">
      <Image alt={props.alt} className="rounded" {...props} />
    </div>
  )
}

export const MDXComponents = {
  CustomLink,
  Image: RoundedImage,
  Playground,
  LikeButtonDemo,
  ProsCard,
  ConsCard,
}
