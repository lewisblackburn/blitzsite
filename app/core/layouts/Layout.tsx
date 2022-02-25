import { Head, BlitzLayout } from "blitz"
import { KBarAnimator, KBarPortal, KBarPositioner, KBarProvider, KBarSearch } from "kbar"
import { Suspense } from "react"
import { Toaster } from "react-hot-toast"
import Header from "../components/Header"
import Loading from "../components/Loading"

const Layout: BlitzLayout<{ title?: string }> = ({ title, children }) => {
  return (
    <>
      <Toaster position="top-right" />
      <Head>
        <title>{title || "lewis"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-5 sm:p-0 min-h-screen bg-gray-900 text-white">
        <div className="wrapper flex flex-col space-y-10 py-10">
          <Suspense fallback={<Loading />}>
            <Header />
          </Suspense>
          {children}
        </div>
      </main>
    </>
  )
}

export default Layout
