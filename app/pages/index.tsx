import Button from "app/core/components/Button"
import NowPlaying from "app/core/components/NowPlaying"
import TopTrackList from "app/core/components/TopTrackList"
import Layout from "app/core/layouts/Layout"
import { dateToYearSince } from "app/lib/dateToYearSince"
import { BlitzPage, dynamic, Link } from "blitz"
import { getAllMdxNodes } from "next-mdx"
import { Post } from "./articles/[...slug]"
import cn from "classnames"

const Map = dynamic(() => import("../core/components/Map"), {
  ssr: false,
})

const PostListStyle = {
  0: "from-[#D8B4FE] to-[#818CF8]",
  1: "from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]",
  2: "from-[#FDE68A] via-[#FCA5A5] to-[#FECACA]",
}

const Home: BlitzPage<{ posts?: Post[] }> = ({ posts }) => {
  return (
    <div className="flex flex-col space-y-10">
      <div className="flex items-center justify-center">
        <article className="prose prose-invert prose-a:text-blue-400 prose-pre:bg-primary prose-code:rounded prose-hr:hidden">
          <p>
            Hey, {"I'm"} Lewis. {"I'm"} a ~{dateToYearSince(new Date("2004-04-14"))} year old
            software developer from the United Kingdom, {"I'm"} interested in full-stack web
            development focusing on large scale type-safe graphql applications
          </p>
          <p>
            I spend my time aimlessly writing redundant documents about projects of which the life
            (and fun) has been painstakingly sucked out of due to meaningless, irrational deadlines.
          </p>
          <p>
            A fun fact about me is that my favourite TV shows are the ones that tell you when to
            laugh! Apart from being a full-time comedian, {"I'm"} creating an entertainment database
            app in my freetime. It aims to be a user-maintained place to share movies, shows, books,
            music and people. If {"you'd"}
            like to contribute, feel free to make a pull request on the GitHub{" "}
            <a href="https://github.com/lewisblackburn/swoosh" rel="noopener noreferrer">
              repository
            </a>
            .
          </p>
          <p></p>

          <p>Hint: for an underwhelming suprise please press super + key.</p>
        </article>
      </div>
      <Button className="w-fit px-4 py-3">View changelog</Button>
      <h1 className="text-3xl font-bold">Featured Articles</h1>
      <div className="grid  grid-cols-2 gap-5 text">
        {posts?.map((post, index) => (
          <Link key={post.slug} href={`/articles/${post.slug}`}>
            <a
              className={cn(
                "transform hover:scale-[1.01] transition-all rounded-xl w-full p-1 bg-gradient-to-r",
                PostListStyle[index]
              )}
            >
              <div className="flex flex-col justify-between h-full bg-gray-900 rounded-lg p-4">
                {post.frontMatter?.title}
              </div>
            </a>
          </Link>
        ))}
      </div>
      <div className="h-72">
        <Map />
      </div>
      <h1 className="text-3xl font-bold">Music</h1>
      <div>
        Below you can see the currently playing music {"I'm"} listening to on Spotify and a list of
        the top tracks {"I've"} listened to from the last twelve months. I listen to a lot of music,
        and you can see more on{" "}
        <a id="external" href="https://www.last.fm/user/xphte">
          last.fm
        </a>
        .
      </div>
      <NowPlaying />
      <TopTrackList />
    </div>
  )
}

export async function getStaticProps() {
  const posts = await getAllMdxNodes("post")

  return {
    props: {
      posts: posts.filter((post: Post) => post?.frontMatter?.featured),
    },
  }
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
