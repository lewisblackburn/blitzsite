import Layout from "app/core/layouts/Layout"
import { BlitzPage, Head, Image } from "blitz"
import "highlight.js/styles/nord.css"
import { useHydrate } from "next-mdx/client"
import { getMdxNode, getMdxPaths, MdxNode } from "next-mdx/server"
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

SnippetPage.getLayout = (page) => <Layout>{page}</Layout>

export default SnippetPage
