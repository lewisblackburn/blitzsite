import { AuthenticationError, Link, useMutation, Routes, PromiseReturnType } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Edit, Login, name } from "app/auth/validations"
import edit from "../mutations/edit"

type EditFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const EditForm = (props: EditFormProps) => {
  const [editMutation] = useMutation(edit)

  return (
    <div className="w-full">
      <Form
        submitText="Edit"
        schema={Edit}
        initialValues={{ name: "" }}
        onSubmit={async (values) => {
          try {
            const user = await editMutation(values)
            props.onSuccess?.(user)
          } catch (error: any) {
            return {
              [FORM_ERROR]:
                "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
            }
          }
        }}
      >
        <LabeledTextField name="name" label="Name" placeholder="Name" />
      </Form>
    </div>
  )
}

export default EditForm
