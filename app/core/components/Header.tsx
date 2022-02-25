import { Link, useRouter } from "blitz"
import cn from "classnames"
import { useEffect, useState } from "react"
import { useCurrentUser } from "../hooks/useCurrentUser"
import NowPlaying from "./NowPlaying"

export interface HeaderProps {}

const HeaderLink: React.FC<{ href: string }> = ({ href, children }) => {
  const router = useRouter()

  const isActive = router.asPath === href

  return (
    <Link href={href}>
      <a
        className={cn(
          isActive ? "font-semibold text-gray-200" : "font-normal text-gray-400",
          "px-3 py-2 rounded hover:bg-gray-800 transition-all"
        )}
      >
        <span>{children}</span>
      </a>
    </Link>
  )
}

export const Header: React.FC<HeaderProps> = () => {
  const user = useCurrentUser()

  return (
    <div className="flex items-center -mx-3">
      <HeaderLink href="/">Home</HeaderLink>
      <HeaderLink href="/articles">Articles</HeaderLink>
      <HeaderLink href="/snippets">Snippets</HeaderLink>
      <HeaderLink href="/bookmarks">Bookmarks</HeaderLink>
      {user?.role === "ADMIN" && (
        <>
          <HeaderLink href="/tags">Tags</HeaderLink>
        </>
      )}
    </div>
  )
}

export default Header
