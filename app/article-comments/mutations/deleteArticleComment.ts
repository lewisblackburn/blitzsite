import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteArticleComment = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteArticleComment),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const articleComment = await db.articleComment.deleteMany({ where: { id } })

    return articleComment
  }
)
