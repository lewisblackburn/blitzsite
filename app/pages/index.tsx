import Button from "app/core/components/Button"
import { MDXComponents } from "app/core/components/MDXComponents"
import NowPlaying from "app/core/components/NowPlaying"
import TopTrackList from "app/core/components/TopTrackList"
import Layout from "app/core/layouts/Layout"
import { dateToYearSince } from "app/lib/dateToYearSince"
import { BlitzPage, dynamic, Link } from "blitz"
import cn from "classnames"
import { getAllMdxNodes } from "next-mdx"
import { useMemo } from "react"
import { Article } from "./articles/[...slug]"

const Map = dynamic(() => import("../core/components/Map"), {
  ssr: false,
})

const ArticleListStyle = {
  0: "from-[#D8B4FE] to-[#818CF8]",
  1: "from-[#FAACA8] to-[#DDD6F3]",
  2: "from-[#1D976C] to-[#93F9B9]",
  3: "from-[#ee9ca7] to-[#ffdde1]",
}

const Home: BlitzPage<{ articles?: Article[] }> = ({ articles }) => {
  const dob = useMemo(() => dateToYearSince(new Date("2004-04-14")), [])

  return (
    <div className="flex flex-col space-y-10">
      <div className="flex items-center justify-center">
        <article className="prose prose-invert prose-a:text-blue-400 prose-pre:bg-primary prose-code:rounded prose-hr:hidden">
          <p>
            Hey, {"I'm"} Lewis. {"I'm"} a ~{dob} year old software developer from the United
            Kingdom, {"I'm"} interested in full-stack web development focusing on large scale
            type-safe graphql applications
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
        {articles?.map((article, index) => (
          <Link key={article.slug} href={`/articles/${article.slug}`}>
            <a
              className={cn(
                "transform hover:scale-[1.01] transition-all rounded-xl w-full p-1 bg-gradient-to-r",
                ArticleListStyle[index]
              )}
            >
              <div className="flex flex-col justify-between h-full bg-gray-900 rounded-lg p-4">
                {article.frontMatter?.title}
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
  const articles = await getAllMdxNodes("article", {
    components: MDXComponents,
  })

  return {
    props: {
      articles: articles.filter((article: Article) => article?.frontMatter?.featured),
    },
  }
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
