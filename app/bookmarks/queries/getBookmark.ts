import { resolver, NotFoundError } from "blitz"
import db from "db"
import { createContext } from "react"
import { z } from "zod"

const GetBookmark = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.string().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetBookmark), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const bookmark = await db.bookmark.findFirst({
    where: { id },
    include: { tag: {}, _count: { select: { reactions: true } } },
  })

  if (!bookmark) throw new NotFoundError()

  return bookmark
})
