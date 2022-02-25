import { MDXComponents } from "app/core/components/MDXComponents"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, Head, Link } from "blitz"
import { getAllMdxNodes } from "next-mdx"
import { useMemo, useState } from "react"
import { useFormState } from "react-final-form"
import { Article } from "./[...slug]"

const ArticlesPage: BlitzPage<{ articles: Article[] }> = ({ articles }) => {
  const [predicate, setPredicate] = useState<string>("")

  const filteredArticles = articles.filter((article) =>
    article.frontMatter?.title.toLowerCase().includes(predicate.toLowerCase())
  )

  return (
    <>
      <Head>
        <title>Articles</title>
      </Head>

      <div className="article">
        <h1>Articles</h1>
        <p>
          {"I've"} been writing online since 2020, mostly about web development. In total, {"I've"}{" "}
          written {articles.length} articles on my blog. Use the search below to filter by title.
        </p>
        <input
          className="w-full mt-2 p-3 rounded-md bg-gray-800 text-gray-300"
          onChange={(e) => setPredicate(e.target.value)}
          value={predicate}
          placeholder="Search..."
        />
      </div>

      {filteredArticles.length === 0 && <span>No articles found.</span>}
      {filteredArticles.map((article) => (
        <Link key={article.slug} href={`/articles/${article.slug}`}>
          <a className="flex flex-col space-y-1">
            <h1 className="text-xl font-bold">{article.frontMatter?.title}</h1>
            <p className="text-gray-300">{article.frontMatter?.excerpt}</p>
          </a>
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
