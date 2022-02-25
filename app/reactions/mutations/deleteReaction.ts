import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteReaction = z.object({
  bookmarkId: z.string().optional(),
  commentId: z.number().optional(),
})

export default resolver.pipe(
  resolver.zod(DeleteReaction),
  resolver.authorize(),
  async ({ bookmarkId, commentId }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    if (bookmarkId) {
      const reaction = await db.reaction.delete({
        where: {
          bookmarkId_userId: {
            bookmarkId: bookmarkId,
            userId: ctx.session.userId,
          },
        },
      })

      return reaction
    }

    if (commentId) {
      const reaction = await db.reaction.delete({
        where: {
          commentId_userId: {
            commentId: commentId,
            userId: ctx.session.userId,
          },
        },
      })

      return reaction
    }
  }
)
