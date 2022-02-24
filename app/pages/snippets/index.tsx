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

      <div className="grid grid-cols-2">
        {snippets.map((snippet) => (
          <Link key={snippet.slug} href={`snippets/${snippet.slug}`}>
            <a className="flex items-center justify-center rounded-xl border border-black/40 bg-black/20 px-6 py-12 md:px-10 md:py-20">
              <h1>{snippet.frontMatter?.title}</h1>
            </a>
          </Link>
        ))}
      </div>
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
