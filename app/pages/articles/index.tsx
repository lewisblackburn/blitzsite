import { MDXComponents } from "app/core/components/MDXComponents"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, Head, Link } from "blitz"
import { getAllMdxNodes } from "next-mdx"
import { Article } from "./[...slug]"

const ArticlesPage: BlitzPage<{ articles: Article[] }> = ({ articles }) => {
  return (
    <>
      <Head>
        <title>Articles</title>
      </Head>

      {articles.map((article) => (
        <Link key={article.slug} href={`articles/${article.slug}`}>
          <a>{article.frontMatter?.title}</a>
        </Link>
      ))}
    </>
  )
}

ArticlesPage.getLayout = (page) => <Layout>{page}</Layout>

export async function getStaticProps() {
  const articles = await getAllMdxNodes("article", {
    components: MDXComponents,
  })

  return {
    props: {
      articles,
    },
  }
}

export default ArticlesPage
