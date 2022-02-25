import { Suspense } from "react"
import {
  Head,
  Link,
  useRouter,
  useQuery,
  useMutation,
  useParam,
  BlitzPage,
  Routes,
  getSession,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import getTag from "app/tags/queries/getTag"
import updateTag from "app/tags/mutations/updateTag"
import { TagForm, FORM_ERROR } from "app/tags/components/TagForm"
import deleteTag from "app/tags/mutations/deleteTag"
import Button from "app/core/components/Button"
import Loading from "app/core/components/Loading"

export const EditTag = () => {
  const router = useRouter()
  const tagId = useParam("tagId", "string")
  const [tag, { setQueryData }] = useQuery(
    getTag,
    { id: tagId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [deleteTagMutation] = useMutation(deleteTag)
  const [updateTagMutation] = useMutation(updateTag)

  return (
    <>
      <Head>
        <title>Edit Tag {tag.id}</title>
      </Head>

      <TagForm
        submitText="Update Tag"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={UpdateTag}
        initialValues={tag}
        onSubmit={async (values) => {
          try {
            const updated = await updateTagMutation({
              id: tag.id,
              ...values,
            })
            await setQueryData(updated)
            router.push(Routes.TagsPage())
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />
      <Button
        className="w-full py-3"
        onClick={async () => {
          if (window.confirm("This will be deleted")) {
            await deleteTagMutation({ id: tag.id })
            router.push(Routes.TagsPage())
          }
        }}
      >
        Delete Tag
      </Button>
    </>
  )
}

const EditTagPage: BlitzPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <EditTag />
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

EditTagPage.authenticate = true
EditTagPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditTagPage
