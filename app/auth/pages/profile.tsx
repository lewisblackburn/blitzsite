import { useRouter, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LoginForm } from "app/auth/components/LoginForm"
import EditForm from "../components/EditForm"
import { notify } from "app/lib/notify"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const ProfilePage: BlitzPage = () => {
  return (
    <div>
      <EditForm onSuccess={(user) => notify(`Name changed to: ${user.name}`, "success")} />
    </div>
  )
}

ProfilePage.authenticate = true
ProfilePage.getLayout = (page) => <Layout title="Profile">{page}</Layout>

export default ProfilePage
