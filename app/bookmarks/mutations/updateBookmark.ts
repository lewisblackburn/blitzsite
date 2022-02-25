import { resolver } from "blitz"
import db from "db"
import { UpdateBookmark } from "../validation"

export default resolver.pipe(
  resolver.zod(UpdateBookmark),
  resolver.authorize("ADMIN"),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const bookmark = await db.bookmark.update({
      where: { id },
      data,
      include: { tag: {}, _count: { select: { reactions: true } } },
    })

    return bookmark
  }
)
