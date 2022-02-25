import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetBookmarksInput
  extends Pick<Prisma.BookmarkFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  async ({
    where,
    orderBy = {
      createdAt: "desc",
    },
    skip = 0,
    take = 100,
  }: GetBookmarksInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: bookmarks,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.bookmark.count({ where }),
      query: (paginateArgs) => db.bookmark.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      bookmarks,
      nextPage,
      hasMore,
      count,
    }
  }
)
