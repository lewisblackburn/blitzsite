import { Card } from "app/core/components/Card"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, Head, Link, Routes } from "blitz"
import { getAllMdxNodes } from "next-mdx"
import { Snippet } from "./[...slug]"

const SnippetsPage: BlitzPage<{ snippets: Snippet[] }> = ({ snippets }) => {
  return (
    <>
      <Head>
        <title>Snippets</title>
      </Head>

      <div className="grid grid-cols-2 gap-10">
        {snippets.map((snippet) => (
          <Link key={snippet.slug} href={Routes.SnippetPage({ slug: snippet.slug })}>
            <a>
              <Card>
                <h1>{snippet.frontMatter?.title}</h1>
              </Card>
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
