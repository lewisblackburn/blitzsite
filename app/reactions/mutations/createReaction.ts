import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateReaction = z.object({
  bookmark: z
    .object({
      connect: z.object({
        id: z.string(),
      }),
    })
    .optional(),
  comment: z
    .object({
      connect: z.object({
        id: z.number(),
      }),
    })
    .optional(),
})

export default resolver.pipe(
  resolver.zod(CreateReaction),
  resolver.authorize(),
  async (data, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const reaction = await db.reaction.create({
      data: {
        ...data,
        user: {
          connect: {
            id: ctx.session.userId,
          },
        },
      },
    })

    return reaction
  }
)
