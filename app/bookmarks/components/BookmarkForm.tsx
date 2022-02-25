import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function BookmarkForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="url" label="URL" placeholder="URL" />
      <LabeledTextField name="host" label="Host" placeholder="Host" />
      <LabeledTextField name="title" label="Title" placeholder="Title" />
      <LabeledTextField name="description" label="Description" placeholder="Description" />
      {props.children}
    </Form>
  )
}
