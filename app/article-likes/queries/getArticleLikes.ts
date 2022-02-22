import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetArticleLike = z.object({
  slug: z.string(),
})

export default resolver.pipe(resolver.zod(GetArticleLike), async ({ slug }, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const articleLike = await db.articleLike.count({
    where: {
      slug,
    },
  })

  const isLiked = await db.articleLike.findUnique({
    where: {
      slug_userId: {
        slug,
        userId: ctx.session.userId ?? 0,
      },
    },
  })

  return { count: articleLike, isLiked: Boolean(isLiked) }
})
