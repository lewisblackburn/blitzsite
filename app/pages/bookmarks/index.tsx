import getBookmarks from "app/bookmarks/queries/getBookmarks"
import Button from "app/core/components/Button"
import Loading from "app/core/components/Loading"
import Spinner from "app/core/components/Spinner"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import getFavicon from "app/lib/getFavicon"
import { BlitzPage, Head, Link, Routes, useInfiniteQuery } from "blitz"
import { Suspense, useEffect } from "react"
import { useInView } from "react-intersection-observer"

export const BookmarksList = () => {
  const user = useCurrentUser()
  const [bookmarkPages, { isFetchingNextPage, fetchNextPage, hasNextPage }] = useInfiniteQuery(
    getBookmarks,
    (page = { take: 10, skip: 0 }) => page,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  )

  const [ref, inView] = useInView({
    threshold: 1,
  })

  useEffect(() => {
    if (inView) {
      if (hasNextPage) fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, inView])

  return (
    <>
      {user?.role === "ADMIN" && (
        <Link href={Routes.NewBookmarkPage()}>
          <a>
            <Button className="w-full px-4 py-3">Create Bookmark</Button>
          </a>
        </Link>
      )}
      {bookmarkPages.map((page, i) => (
        <ul key={i} className="grid grid-cols-1 gap-10">
          {page.bookmarks.map((bookmark) => (
            <li key={bookmark.id}>
              <Link href={Routes.ShowBookmarkPage({ bookmarkId: bookmark.id })}>
                <a>
                  <div className="flex flex-col space-y-2 rounded-xl border border-black/40 bg-black/20 p-5">
                    <h1>
                      {bookmark.host} {bookmark.host && ">"} {bookmark.title}
                    </h1>
                    <div className="flex items-center space-x-2">
                      <img src={getFavicon(bookmark.url)} alt="favicon" className="w-4 h-4" />
                      <p>{bookmark.url}</p>
                    </div>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      ))}
      {hasNextPage && (
        <div ref={ref} className="flex items-center justify-center py-5">
          {isFetchingNextPage ? <Spinner /> : hasNextPage && <Spinner />}
        </div>
      )}
    </>
  )
}
const BookmarksPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Bookmarks</title>
      </Head>

      <Suspense fallback={<Loading />}>
        <BookmarksList />
      </Suspense>
    </>
  )
}

BookmarksPage.getLayout = (page) => <Layout>{page}</Layout>

export default BookmarksPage
