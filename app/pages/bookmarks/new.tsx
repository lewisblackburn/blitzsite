import { Link, useRouter, useMutation, BlitzPage, Routes, getSession } from "blitz"
import Layout from "app/core/layouts/Layout"
import createBookmark from "app/bookmarks/mutations/createBookmark"
import { BookmarkForm, FORM_ERROR } from "app/bookmarks/components/BookmarkForm"
import { Bookmark } from "app/bookmarks/validation"

const NewBookmarkPage: BlitzPage = () => {
  const router = useRouter()
  const [createBookmarkMutation] = useMutation(createBookmark)

  return (
    <BookmarkForm
      submitText="Create Bookmark"
      schema={Bookmark}
      initialValues={{}}
      onSubmit={async (values) => {
        try {
          const bookmark = await createBookmarkMutation(values)
          router.push(Routes.ShowBookmarkPage({ bookmarkId: bookmark.id }))
        } catch (error: any) {
          console.error(error)
          return {
            [FORM_ERROR]: error.toString(),
          }
        }
      }}
    />
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

NewBookmarkPage.authenticate = true
NewBookmarkPage.getLayout = (page) => <Layout title="Create New Bookmark">{page}</Layout>

export default NewBookmarkPage
