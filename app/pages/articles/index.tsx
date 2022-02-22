import Layout from "app/core/layouts/Layout"
import { BlitzPage, Head, Link } from "blitz"
import { getAllMdxNodes } from "next-mdx"
import { Post } from "./[...slug]"

const PostsPage: BlitzPage<{ posts: Post[] }> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Articles</title>
      </Head>

      {posts.map((post) => (
        <Link key={post.slug} href={`articles/${post.slug}`}>
          <a>{post.frontMatter?.title}</a>
        </Link>
      ))}
    </>
  )
}

PostsPage.getLayout = (page) => <Layout>{page}</Layout>

export async function getStaticProps() {
  const posts = await getAllMdxNodes("post")

  return {
    props: {
      posts,
    },
  }
}

export default PostsPage
