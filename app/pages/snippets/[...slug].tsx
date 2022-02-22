import createArticleComment from "app/article-comments/mutations/createArticleComment"
import getArticleComments from "app/article-comments/queries/getArticleComments"
import createArticleLike from "app/article-likes/mutations/createArticleLike"
import deleteArticleLike from "app/article-likes/mutations/deleteArticleLike"
import getArticleLikes from "app/article-likes/queries/getArticleLikes"
import Icon from "app/core/components/Icon"
import { IconButton } from "app/core/components/IconButton"
import { Button } from "app/core/components/Button"
import Loading from "app/core/components/Loading"
import Spinner from "app/core/components/Spinner"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, Head, Link, useInfiniteQuery, useMutation, useQuery } from "blitz"
import cn from "classnames"
import "highlight.js/styles/nord.css"
import { getTableOfContents, TableOfContents } from "next-mdx-toc"
import { useHydrate } from "next-mdx/client"
import { getMdxNode, getMdxPaths, MdxNode } from "next-mdx/server"
import { Suspense, useEffect, useState } from "react"
import { IoArrowBack, IoChatbox, IoHeart, IoSend } from "react-icons/io5"
import { useInView } from "react-intersection-observer"
import rehypeHighlight from "rehype-highlight"
import remarkAutolinkHeadings from "remark-autolink-headings"
import remarkCodeTitles from "remark-code-titles"
import remarkSlug from "remark-slug"

export interface Snippet
  extends MdxNode<{
    title: string
    description: string
    logo: string
  }> {}

export const Snippet = ({ snippet, content }) => {
  return (
    <>
      <div className="wrapper">
        <article className="article">
          <h1>{snippet.frontMatter?.title}</h1>
          {snippet.frontMatter?.description ? <p>{snippet?.frontMatter.description}</p> : null}
          {content}
        </article>
      </div>
    </>
  )
}

const SnippetPage: BlitzPage<{ snippet: Snippet }> = ({ snippet }) => {
  const content = useHydrate(snippet)

  return (
    <>
      <Head>
        <title>{snippet.frontMatter?.title}</title>
      </Head>

      <div className="w-full">
        <Snippet snippet={snippet} content={content} />
      </div>
    </>
  )
}

SnippetPage.authenticate = false
SnippetPage.getLayout = (page) => <Layout>{page}</Layout>

export default SnippetPage

export async function getStaticPaths() {
  return {
    paths: await getMdxPaths("snippet"),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const snippet = await getMdxNode<Snippet>("snippet", context, {
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

  if (!snippet) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      snippet,
    },
  }
}
