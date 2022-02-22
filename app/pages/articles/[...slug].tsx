import createArticleComment from "app/article-comments/mutations/createArticleComment"
import deleteArticleComment from "app/article-comments/mutations/deleteArticleComment"
import getArticleComments from "app/article-comments/queries/getArticleComments"
import createArticleLike from "app/article-likes/mutations/createArticleLike"
import deleteArticleLike from "app/article-likes/mutations/deleteArticleLike"
import getArticleLikes from "app/article-likes/queries/getArticleLikes"
import Avatar from "app/core/components/Avatar"
import { IconButton } from "app/core/components/IconButton"
import Loading from "app/core/components/Loading"
import { MDXComponents } from "app/core/components/MDXComponents"
import Spinner from "app/core/components/Spinner"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import { notify } from "app/lib/notify"
import { BlitzPage, Head, Link, useInfiniteQuery, useMutation, useQuery } from "blitz"
import cn from "classnames"
import "highlight.js/styles/nord.css"
import { getTableOfContents, TableOfContents } from "next-mdx-toc"
import { useHydrate } from "next-mdx/client"
import { getMdxNode, getMdxPaths, MdxNode } from "next-mdx/server"
import { Suspense, useEffect, useState } from "react"
import { IoHeart, IoPencil, IoSend, IoTrash } from "react-icons/io5"
import { useInView } from "react-intersection-observer"
import rehypeHighlight from "rehype-highlight"
import remarkAutolinkHeadings from "remark-autolink-headings"
import remarkCodeTitles from "remark-code-titles"
import remarkSlug from "remark-slug"

export interface Article
  extends MdxNode<{
    title: string
    excerpt: string
    date: string
    featured: boolean
  }> {}

function Toc({ tree }: { tree: TableOfContents }) {
  return tree?.items?.length ? (
    <ul>
      {tree.items.map((item) => {
        return (
          <li key={item.title}>
            <a href={item.url}>{item.title}</a>
            {item.items?.length ? <Toc tree={item} /> : null}
          </li>
        )
      })}
    </ul>
  ) : null
}

export const Article = ({ article, toc, content }) => {
  const slug = article.slug
  const user = useCurrentUser()
  const [createArticleLikeMutation, { isLoading: isLiking }] = useMutation(createArticleLike)
  const [deleteArticleLikeMutation, { isLoading: isUnliking }] = useMutation(deleteArticleLike)
  const [createArticleCommentMutation] = useMutation(createArticleComment)
  const [deleteArticleCommentMutation] = useMutation(deleteArticleComment)
  const [likes, { refetch: refetchLikes, isFetching: isFetchingLikes }] = useQuery(
    getArticleLikes,
    { slug }
  )

  const [
    articleCommentPages,
    { refetch: refetchComments, isFetchingNextPage, fetchNextPage, hasNextPage },
  ] = useInfiniteQuery(
    getArticleComments,
    (
      page = {
        where: {
          slug: {
            equals: slug,
          },
        },
        take: 18,
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

  const [comment, setComment] = useState("")

  useEffect(() => {
    if (inView) {
      if (hasNextPage) fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, inView])

  return (
    <>
      <Head>
        <title>{article.title}</title>
      </Head>
      <div className="wrapper">
        <div className="fixed bottom-4 right-5 ">
          <IconButton
            onClick={async () => {
              if (slug) {
                if (!likes.isLiked)
                  await createArticleLikeMutation({ slug }).catch((e) => notify(e.message, "error"))
                else
                  await deleteArticleLikeMutation({ slug }).catch((e) => notify(e.message, "error"))
                refetchLikes()
              }
            }}
            icon={IoHeart}
            className={cn("h-8", {
              "text-red-500": likes.isLiked,
            })}
            loading={isLiking || isUnliking || isFetchingLikes}
            disabled={isLiking || isUnliking || isFetchingLikes}
          >
            {likes.count}
          </IconButton>
        </div>

        <article className="article">
          <h1>{article.frontMatter?.title}</h1>
          {article.frontMatter?.excerpt ? <p>{article?.frontMatter.excerpt}</p> : null}
          {content}
        </article>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          if (slug)
            await createArticleCommentMutation({ slug, text: comment })
              .then(() => notify("Comment created", "success"))
              .catch((e) => notify(e.message, "error"))
          setComment("")
          refetchComments()
        }}
        className="flex w-full flex-none items-center wrapper pt-10"
      >
        <div className="relative flex w-full flex-none">
          <textarea
            name="text"
            className="w-full rounded-md px-4 py-3 h-12 overflow-hidden resize-none bg-gray-800 block"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            placeholder="Write a comment..."
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

      <div className="wrapper flex flex-col space-y-10 py-10">
        {articleCommentPages.map((page, i) => (
          <ul key={i} className="flex flex-col space-y-10">
            {page.comments.map((comment) => (
              <li
                key={comment.id}
                className="grid grid-cols-2 gap-4"
                style={{ gridTemplateColumns: "2.5rem 1fr" }}
              >
                <Avatar text={comment.user.name} />
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span>{comment.user.name}</span>
                      <span className="text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {comment.user.id === user?.id && (
                      <IconButton
                        icon={IoTrash}
                        onClick={async () => {
                          if (comment.user.id === user?.id) {
                            await deleteArticleCommentMutation({ id: comment.id })
                              .then(() => notify("Comment deleted", "success"))
                              .catch((e) => notify(e.message, "error"))
                          }
                          refetchComments()
                        }}
                      />
                    )}
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
      </div>
    </>
  )
}

const ArticlePage: BlitzPage<{ article: Article; toc: any }> = ({ article, toc }) => {
  const content = useHydrate(article, {
    components: MDXComponents,
  })

  return (
    <>
      <Head>
        <title>{article.frontMatter?.title}</title>
      </Head>

      <div className="w-full">
        <Suspense fallback={<Loading />}>
          <Article article={article} toc={toc} content={content} />
        </Suspense>
      </div>
    </>
  )
}

ArticlePage.getLayout = (page) => <Layout>{page}</Layout>

export default ArticlePage

export async function getStaticPaths() {
  return {
    paths: await getMdxPaths("article"),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const article = await getMdxNode<Article>("article", context, {
    components: MDXComponents,
    mdxOptions: {
      rehypePlugins: [rehypeHighlight],
      remarkPlugins: [
        remarkSlug,
        [
          remarkAutolinkHeadings,
          {
            properties: {
              className: ["anchor"],
            },
          },
        ],
        ,
        remarkCodeTitles,
      ],
    },
  })

  if (!article) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      article,
      toc: await getTableOfContents(article),
    },
  }
}
