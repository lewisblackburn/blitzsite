import { Link, useRouter, useMutation, BlitzPage, Routes, getSession } from "blitz"
import Layout from "app/core/layouts/Layout"
import createTag from "app/tags/mutations/createTag"
import { TagForm, FORM_ERROR } from "app/tags/components/TagForm"

const NewTagPage: BlitzPage = () => {
  const router = useRouter()
  const [createTagMutation] = useMutation(createTag)

  return (
    <div>
      <h1>Create New Tag</h1>

      <TagForm
        submitText="Create Tag"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateTag}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const tag = await createTagMutation(values)
            router.push(Routes.TagsPage())
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.TagsPage()}>
          <a>Tags</a>
        </Link>
      </p>
    </div>
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

NewTagPage.authenticate = true
NewTagPage.getLayout = (page) => <Layout title={"Create New Tag"}>{page}</Layout>

export default NewTagPage
