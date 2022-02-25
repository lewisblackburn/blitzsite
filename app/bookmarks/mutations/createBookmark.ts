import { resolver } from "blitz"
import db from "db"
import { Bookmark } from "../validation"

export default resolver.pipe(resolver.zod(Bookmark), resolver.authorize("ADMIN"), async (data) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const bookmark = await db.bookmark.create({
    data: {
      ...data,
      tag: {},
    },
  })

  return bookmark
})
