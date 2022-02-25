import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateReaction = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateReaction),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const reaction = await db.reaction.update({ where: { id }, data })

    return reaction
  }
)
