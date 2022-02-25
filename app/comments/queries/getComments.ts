import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetCommentsInput
  extends Pick<Prisma.CommentFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy = { createdAt: "desc" }, skip = 0, take = 100 }: GetCommentsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: comments,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.comment.count({ where }),
      query: (paginateArgs) =>
        db.comment.findMany({ ...paginateArgs, where, orderBy, include: { author: true } }),
    })

    return {
      comments,
      nextPage,
      hasMore,
      count,
    }
  }
)
