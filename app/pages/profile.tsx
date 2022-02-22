import Layout from "app/core/layouts/Layout"
import { BlitzPage } from "blitz"

const Profile: BlitzPage = () => {
  return (
    <div>
      <input placeholder="f" className="bg-gray-800 rounded p-2 w-full" />
    </div>
  )
}

Profile.authenticate = true
Profile.getLayout = (page) => <Layout title="Profile">{page}</Layout>

export default Profile
