import { Head, BlitzLayout } from "blitz"
import { Toaster } from "react-hot-toast"
import Header from "../components/Header"

const AuthLayout: BlitzLayout<{ title?: string }> = ({ title, children }) => {
  return (
    <>
      <Toaster position="top-right" />
      <Head>
        <title>{title || "lewis"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-5 sm:p-0 min-h-screen bg-gray-900 text-white">
        <div className="wrapper grid place-items-center min-h-screen">{children}</div>
      </main>
    </>
  )
}

export default AuthLayout
