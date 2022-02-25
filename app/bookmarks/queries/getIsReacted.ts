import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetBookmark = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.string().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetBookmark),
  resolver.authorize(),
  async ({ id }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const isLiked = await db.reaction.findUnique({
      where: {
        bookmarkId_userId: {
          bookmarkId: id ?? "",
          userId: ctx.session.userId,
        },
      },
    })
    return Boolean(isLiked)
  }
)
