import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes, getSession } from "blitz"
import Layout from "app/core/layouts/Layout"
import getTags from "app/tags/queries/getTags"
import Button from "app/core/components/Button"
import { Card } from "app/core/components/Card"
import Loading from "app/core/components/Loading"

const ITEMS_PER_PAGE = 100

export const TagsList = () => {
  const [{ tags }] = usePaginatedQuery(getTags, {
    orderBy: { id: "asc" },
  })

  return (
    <div className="grid grid-cols-2 gap-10">
      {tags.map((tag) => (
        <Link key={tag.id} href={Routes.EditTagPage({ tagId: tag.id })}>
          <a>
            <Card>
              <h1>{tag.name}</h1>
            </Card>
          </a>
        </Link>
      ))}
    </div>
  )
}

const TagsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Tags</title>
      </Head>

      <div className="flex flex-col space-y-10">
        <Suspense fallback={<Loading />}>
          <TagsList />
        </Suspense>

        <Link href={Routes.NewTagPage()}>
          <a>
            <Button className="w-full px-4 py-3">Create Tag</Button>
          </a>
        </Link>
      </div>
    </>
  )
}

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res)

  if (session.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return { props: {} }
}

TagsPage.authenticate = true
TagsPage.getLayout = (page) => <Layout>{page}</Layout>

export default TagsPage
