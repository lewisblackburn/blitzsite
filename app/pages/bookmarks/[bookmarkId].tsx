import { Suspense, useEffect, useState } from "react"
import {
  Head,
  useRouter,
  useQuery,
  useParam,
  BlitzPage,
  useMutation,
  Routes,
  useInfiniteQuery,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import getBookmark from "app/bookmarks/queries/getBookmark"
import deleteBookmark from "app/bookmarks/mutations/deleteBookmark"
import createReaction from "app/reactions/mutations/createReaction"
import getIsLiked from "app/bookmarks/queries/getIsReacted"
import deleteReaction from "app/reactions/mutations/deleteReaction"
import createComment from "app/comments/mutations/createComment"
import getComments from "app/comments/queries/getComments"
import { useInView } from "react-intersection-observer"
import Spinner from "app/core/components/Spinner"
import { IconButton } from "app/core/components/IconButton"
import cn from "classnames"
import { IoHeart, IoSend, IoTrash, IoColorWand, IoLink } from "react-icons/io5"
import { notify } from "app/lib/notify"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Avatar from "app/core/components/Avatar"
import deleteComment from "app/comments/mutations/deleteComment"
import { Tag } from "app/core/components/Tag"
import Button from "app/core/components/Button"
import Icon from "app/core/components/Icon"
import removeHttps from "app/lib/removeHttps"
import getFavicon from "app/lib/getFavicon"
import Loading from "app/core/components/Loading"

export const Bookmark = () => {
  const router = useRouter()
  const user = useCurrentUser()
  const bookmarkId = useParam("bookmarkId", "string")
  const [isReacted, { refetch: refetchIsReacted, isLoading: isFetchingIsReacted }] = useQuery(
    getIsLiked,
    { id: bookmarkId }
  )
  const [createReactionMutation, { isLoading: isReacting }] = useMutation(createReaction)
  const [deleteReactionMutation, { isLoading: isUnreacting }] = useMutation(deleteReaction)
  const [deleteBookmarkMutation] = useMutation(deleteBookmark)
  const [createCommentMutation] = useMutation(createComment)
  const [deleteCommentMutation] = useMutation(deleteComment)
  const [bookmark, { refetch: refetchBookmark }] = useQuery(getBookmark, { id: bookmarkId })

  const [comment, setComment] = useState("")

  const [
    commentPages,
    { refetch: refetchComments, isFetchingNextPage, fetchNextPage, hasNextPage },
  ] = useInfiniteQuery(
    getComments,
    (
      page = {
        where: {
          bookmark: {
            id: bookmark.id,
          },
        },
        take: 10,
        skip: 0,
      }
    ) => page,
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

  console.log(getFavicon(bookmark.url))

  return (
    <>
      <Head>
        <title>Bookmark {bookmark.id}</title>
      </Head>

      <div className="fixed bottom-4 right-5 flex items-center space-x-5">
        <IconButton
          onClick={async () => {
            if (isReacted) {
              await deleteReactionMutation({
                bookmarkId: bookmark.id,
              })
                .then(() => notify("Reaction deleted", "success"))
                .catch((e) => notify(e.message, "error"))
            } else {
              await createReactionMutation({
                bookmark: {
                  connect: {
                    id: bookmark.id,
                  },
                },
              })
                .then(() => notify("Reaction created", "success"))
                .catch((e) => notify(e.message, "error"))
            }
            refetchIsReacted()
            refetchBookmark()
          }}
          icon={IoHeart}
          className={cn("h-8", {
            "text-red-500": isReacted,
          })}
          loading={isReacting || isUnreacting || isFetchingIsReacted}
          disabled={isReacting || isUnreacting || isFetchingIsReacted}
        >
          {bookmark._count.reactions}
        </IconButton>
        {user?.role === "ADMIN" && (
          <>
            <IconButton
              icon={IoTrash}
              onClick={async () => {
                if (window.confirm("This will be deleted")) {
                  await deleteBookmarkMutation({ id: bookmark.id })
                    .then(() => notify("Bookmark deleted", "success"))
                    .catch((e) => notify(e.message, "error"))
                  router.push(Routes.BookmarksPage())
                }
              }}
            />
            <IconButton
              icon={IoColorWand}
              onClick={() => {
                router.push(Routes.EditBookmarkPage({ bookmarkId: bookmark.id }))
              }}
            />
          </>
        )}
      </div>

      <div className="flex flex-col space-y-5">
        <Tag>{bookmark.tag?.name}</Tag>
        <h1 className="text-2xl font-bold xl:text-3xl">
          {bookmark.host} {bookmark.host && ">"} {bookmark.title}
        </h1>
        <div className="flex items-center space-x-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={getFavicon(bookmark.url)} alt="favicon" className="w-4 h-4" />
          <span>{removeHttps(bookmark.url)}</span>
        </div>
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
          <Button className="flex items-center justify-center space-x-2 w-full py-3 mt-10">
            <Icon icon={IoLink} />
            <span>Visit</span>
          </Button>
        </a>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          await createCommentMutation({
            text: comment,
            bookmark: { connect: { id: bookmark.id } },
          })
            .then(() => notify("Comment created", "success"))
            .catch((e) => notify(e.message, "error"))
          setComment("")
          refetchComments()
        }}
        className="flex w-full flex-none items-center wrapper pt-10"
      >
        <div className="relative flex w-full">
          <span
            role="textbox"
            className="w-full h-auto rounded-md px-4 py-3 resize-none bg-gray-800 outline-none"
            onInput={(e) => setComment(e.currentTarget.textContent ?? "")}
            placeholder="Write a comment..."
            contentEditable
          />
          <div className="absolute p-0.5 right-1 bottom-1">
            <IconButton
              icon={IoSend}
              className={cn(
                "bg-gray-900 hover:bg-gray-900 hover:text-white bg-opacity-80 border-none text-gray-600",
                {
                  "bg-transparent hover:bg-transparent hover:text-gray-600": comment.length < 1,
                }
              )}
              disabled={comment.length < 1}
            />
          </div>
        </div>
      </form>

      {commentPages.map((page, i) => (
        <ul key={i} className="grid grid-cols-1 gap-10">
          {page.comments.map((comment) => (
            <li
              key={comment.id}
              className="grid grid-cols-2 gap-4"
              style={{ gridTemplateColumns: "2.5rem 1fr" }}
            >
              <Avatar text={comment.author.name} />
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>{comment.author.name}</span>
                    <span className="text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {comment.author.id === user?.id && (
                    <IconButton
                      icon={IoTrash}
                      onClick={async () => {
                        if (comment.author.id === user?.id) {
                          await deleteCommentMutation({ id: comment.id })
                            .then(() => notify("Comment deleted", "success"))
                            .catch((e) => notify(e.message, "error"))
                        }
                        refetchComments()
                      }}
                    />
                  )}{" "}
                </div>
                <p className="whitespace-pre-line">{comment.text}</p>
              </div>
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

const ShowBookmarkPage: BlitzPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Bookmark />
    </Suspense>
  )
}

ShowBookmarkPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowBookmarkPage
