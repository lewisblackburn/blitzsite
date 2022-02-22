import createArticleComment from "app/article-comments/mutations/createArticleComment"
import getArticleComments from "app/article-comments/queries/getArticleComments"
import createArticleLike from "app/article-likes/mutations/createArticleLike"
import deleteArticleLike from "app/article-likes/mutations/deleteArticleLike"
import getArticleLikes from "app/article-likes/queries/getArticleLikes"
import Avatar from "app/core/components/Avatar"
import { IconButton } from "app/core/components/IconButton"
import Loading from "app/core/components/Loading"
import { MDXComponents } from "app/core/components/MDXComponents"
import Spinner from "app/core/components/Spinner"
import Layout from "app/core/layouts/Layout"
import { notify } from "app/lib/notify"
import { BlitzPage, Head, useInfiniteQuery, useMutation, useQuery } from "blitz"
import cn from "classnames"
import "highlight.js/styles/nord.css"
import { getTableOfContents, TableOfContents } from "next-mdx-toc"
import { useHydrate } from "next-mdx/client"
import { getMdxNode, getMdxPaths, MdxNode } from "next-mdx/server"
import { Suspense, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { IoHeart, IoSend } from "react-icons/io5"
import { useInView } from "react-intersection-observer"
import rehypeHighlight from "rehype-highlight"
import remarkAutolinkHeadings from "remark-autolink-headings"
import remarkCodeTitles from "remark-code-titles"
import remarkSlug from "remark-slug"

export type Category = MdxNode<{
  name: string
}>

export interface Post
  extends MdxNode<{
    title: string
    excerpt: string
    date: string
    cover: string
    tags: string[]
    author: {
      name: string
      twitter: string
      avatar: string
    }
    featured: boolean
    category?: string[]
  }> {
  relationships?: {
    category: Category[]
  }
}

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

export const Article = ({ post, toc, content }) => {
  const slug = post.slug
  const [createArticleLikeMutation, { isLoading: isLiking }] = useMutation(createArticleLike)
  const [deleteArticleLikeMutation, { isLoading: isUnliking }] = useMutation(deleteArticleLike)
  const [createArticleCommentMutation] = useMutation(createArticleComment)
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
        <title>{post.title}</title>
      </Head>
      <div className="wrapper">
        <IconButton
          onClick={async () => {
            if (slug) {
              if (!likes.isLiked)
                await createArticleLikeMutation({ slug }).catch((e) => notify(e.message))
              else await deleteArticleLikeMutation({ slug }).catch((e) => notify(e.message))
              refetchLikes()
            }
          }}
          icon={IoHeart}
          className={cn("fixed bottom-4 right-5 h-8", {
            "text-red-500": likes.isLiked,
          })}
          loading={isLiking || isUnliking || isFetchingLikes}
          disabled={isLiking || isUnliking || isFetchingLikes}
        >
          {likes.count}
        </IconButton>
        <article className="article">
          <h1>{post.frontMatter?.title}</h1>
          {post.frontMatter?.excerpt ? <p>{post?.frontMatter.excerpt}</p> : null}
          <Toc tree={toc} />
          {content}
        </article>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          if (slug)
            await createArticleCommentMutation({ slug, text: comment }).catch((e) =>
              notify(e.message)
            )
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
                  <div className="flex items-center space-x-4">
                    <span>{comment.user.name}</span>
                    <span className="text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
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

const ArticlePage: BlitzPage<{ post: Post; toc: any }> = ({ post, toc }) => {
  const content = useHydrate(post, {
    components: MDXComponents,
  })

  return (
    <>
      <Head>
        <title>{post.frontMatter?.title}</title>
      </Head>

      <div className="w-full">
        <Suspense fallback={<Loading />}>
          <Article post={post} toc={toc} content={content} />
        </Suspense>
      </div>
    </>
  )
}

// ArticlePage.authenticate = false
ArticlePage.getLayout = (page) => <Layout>{page}</Layout>

export default ArticlePage

export async function getStaticPaths() {
  return {
    paths: await getMdxPaths("post"),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const post = await getMdxNode<Post>("post", context, {
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

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
      toc: await getTableOfContents(post),
    },
  }
}
