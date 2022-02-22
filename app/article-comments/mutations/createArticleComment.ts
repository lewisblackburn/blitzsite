import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateArticleComment = z.object({
  slug: z.string(),
  text: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateArticleComment),
  resolver.authorize(),
  async ({ slug, text }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const articleComment = await db.articleComment.create({
      data: {
        slug,
        user: {
          connect: {
            id: ctx.session.userId,
          },
        },
        text,
      },
    })

    return articleComment
  }
)
