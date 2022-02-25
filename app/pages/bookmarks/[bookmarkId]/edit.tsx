import { BookmarkForm, FORM_ERROR } from "app/bookmarks/components/BookmarkForm"
import updateBookmark from "app/bookmarks/mutations/updateBookmark"
import getBookmark from "app/bookmarks/queries/getBookmark"
import { Bookmark } from "app/bookmarks/validation"
import { IconButton } from "app/core/components/IconButton"
import Layout from "app/core/layouts/Layout"
import getTags from "app/tags/queries/getTags"
import {
  BlitzPage,
  getSession,
  Head,
  Routes,
  useMutation,
  usePaginatedQuery,
  useParam,
  useQuery,
  useRouter,
} from "blitz"
import { Suspense } from "react"
import { IoAdd, IoTrash } from "react-icons/io5"

export const EditBookmark = () => {
  const router = useRouter()
  const bookmarkId = useParam("bookmarkId", "string")
  const [bookmark, { setQueryData }] = useQuery(
    getBookmark,
    { id: bookmarkId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [{ tags }] = usePaginatedQuery(getTags, {
    orderBy: { id: "asc" },
  })
  const [updateBookmarkMutation] = useMutation(updateBookmark)

  return (
    <>
      <Head>
        <title>Edit Bookmark {bookmark.id}</title>
      </Head>

      <BookmarkForm
        submitText="Update Bookmark"
        schema={Bookmark}
        initialValues={bookmark}
        onSubmit={async (values) => {
          try {
            const updated = await updateBookmarkMutation({
              id: bookmark.id,
              ...values,
              tag: {},
            })
            await setQueryData(updated)
            router.push(Routes.ShowBookmarkPage({ bookmarkId: updated.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      >
        <select
          className="w-full mt-2 p-3 rounded-md bg-gray-800 text-gray-300"
          defaultValue={bookmark.tag?.id}
          onChange={async (e) => {
            console.log(e.target.value)
            if (e.target.value === "") {
              await updateBookmarkMutation({
                ...bookmark,
                tag: {
                  disconnect: true,
                },
              })
            } else {
              await updateBookmarkMutation({
                ...bookmark,
                tag: {
                  connect: {
                    id: e.target.value,
                  },
                },
              })
            }
          }}
        >
          <option />
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </BookmarkForm>
    </>
  )
}

const EditBookmarkPage: BlitzPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditBookmark />
    </Suspense>
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

EditBookmarkPage.authenticate = true
EditBookmarkPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditBookmarkPage
