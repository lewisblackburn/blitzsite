import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetArticleCommentsInput
  extends Pick<Prisma.ArticleCommentFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({
    where,
    orderBy = { createdAt: "desc" },
    skip = 0,
    take = 100,
  }: GetArticleCommentsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: comments,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.articleComment.count({ where }),
      query: (paginateArgs) =>
        db.articleComment.findMany({ ...paginateArgs, where, orderBy, include: { user: true } }),
    })

    return {
      comments,
      nextPage,
      hasMore,
      count,
    }
  }
)
