import { useRouter, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LoginForm } from "app/auth/components/LoginForm"
import AuthLayout from "app/core/layouts/Auth"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <LoginForm
      onSuccess={(_user) => {
        const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/"
        router.push(next)
      }}
    />
  )
}

LoginPage.redirectAuthenticatedTo = "/"
LoginPage.getLayout = (page) => <AuthLayout title="Log in">{page}</AuthLayout>

export default LoginPage
