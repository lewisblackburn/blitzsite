import { Ctx, resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateArticleLike = z.object({
  slug: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateArticleLike),
  resolver.authorize(),
  async ({ slug }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    console.log("USERID", ctx.session.userId)

    const articleLike = await db.articleLike.create({
      data: {
        slug,
        user: {
          connect: { id: ctx.session.userId },
        },
      },
    })

    return articleLike
  }
)
