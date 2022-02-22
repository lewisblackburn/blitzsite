import Layout from "app/core/layouts/Layout"
import { BlitzPage, Head, Link } from "blitz"
import { getAllMdxNodes } from "next-mdx"
import { Snippet } from "./[...slug]"

const SnippetsPage: BlitzPage<{ snippets: Snippet[] }> = ({ snippets }) => {
  return (
    <>
      <Head>
        <title>Snippets</title>
      </Head>

      {snippets.map((snippet) => (
        <Link key={snippet.slug} href={`snippets/${snippet.slug}`}>
          <a>{snippet.frontMatter?.title}</a>
        </Link>
      ))}
    </>
  )
}

SnippetsPage.getLayout = (page) => <Layout>{page}</Layout>

export async function getStaticProps() {
  const snippets = await getAllMdxNodes("snippet")

  return {
    props: {
      snippets,
    },
  }
}

export default SnippetsPage
