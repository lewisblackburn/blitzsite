import { data } from "autoprefixer"
import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateComment = z.object({
  bookmark: z
    .object({
      connect: z.object({
        id: z.string(),
      }),
    })
    .optional(),
  text: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateComment),
  resolver.authorize(),
  async (data, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const comment = await db.comment.create({
      data: {
        ...data,
        author: {
          connect: {
            id: ctx.session.userId,
          },
        },
      },
    })

    return comment
  }
)
