import { Image, Link } from "blitz"

function Callout({ children, ...props }) {
  return <div className="bg-red-300">{children}</div>
}

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
}
