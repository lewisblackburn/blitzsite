import { useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { SignupForm } from "app/auth/components/SignupForm"
import AuthLayout from "app/core/layouts/Auth"

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return <SignupForm onSuccess={() => router.push(Routes.Home())} />
}

SignupPage.redirectAuthenticatedTo = "/"
SignupPage.getLayout = (page) => <AuthLayout title="Sign Up">{page}</AuthLayout>

export default SignupPage
