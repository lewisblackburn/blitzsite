import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteArticleLike = z.object({
  slug: z.string(),
})

export default resolver.pipe(
  resolver.zod(DeleteArticleLike),
  resolver.authorize(),
  async ({ slug }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const articleLike = await db.articleLike.delete({
      where: {
        slug_userId: {
          slug,
          userId: ctx.session.userId,
        },
      },
    })

    return articleLike
  }
)
