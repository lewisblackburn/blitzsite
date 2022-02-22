import {
  AppProps,
  ErrorBoundary,
  ErrorComponent,
  AuthenticationError,
  AuthorizationError,
  ErrorFallbackProps,
  useQueryErrorResetBoundary,
  Head,
  Routes,
  useRouter,
  useMutation,
} from "blitz"
import LoginForm from "app/auth/components/LoginForm"

import "app/core/styles/index.css"
import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  useMatches,
  KBarResults,
  createAction,
  ActionId,
  ActionImpl,
} from "kbar"
import cn from "classnames"
import data from "content/posts/data"
import { IoHome, IoLogoTumblr } from "react-icons/io5"
import logout from "app/auth/mutations/logout"
import Layout from "app/core/layouts/Layout"

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()
  const [logoutMutation] = useMutation(logout)
  const actions = [
    {
      id: "homeAction",
      name: "Home",
      shortcut: ["h"],
      section: "Navigation",
      perform: () => router.push("/"),
      icon: <IoHome />,
    },
    {
      id: "articlesAction",
      name: "Articles",
      shortcut: ["g", "a"],
      section: "Navigation",
      perform: () => router.push("/articles"),
    },
    {
      id: "snippetsAction",
      name: "Snippets",
      shortcut: ["g", "s"],
      section: "Navigation",
      perform: () => router.push("/snippets"),
    },
    {
      id: "profileAction",
      name: "Profile",
      shortcut: ["g", "p"],
      section: "Navigation",
      perform: () => router.push("/profile"),
    },
    {
      id: "findAction",
      name: "Find",
      shortcut: ["?"],
      keywords: "find",
      section: "Navigation",
    },
    ...Object.keys(data).map((post) => ({
      id: data[post].slug,
      name: data[post].title,
      keywords: data[post].excerpt,
      perform: () => router.push(data[post].slug),
      section: "Article",
      parent: "findAction",
    })),
    {
      id: "loginAction",
      name: "Login",
      section: "Authentication",
      perform: () => router.push("/login"),
    },
    {
      id: "logoutAction",
      name: "Logout",
      section: "Authentication",
      perform: async () => logoutMutation(),
    },
    {
      id: "twitterAction",
      name: "Twitter",
      shortcut: ["t"],
      keywords: "social contact dm",
      section: "Social",
      perform: () => window.open("https://twitter.com/zxffo", "_blank"),
    },
    createAction({
      name: "Github",
      shortcut: ["g", "h"],
      section: "Social",
      perform: () => window.open("https://github.com/lewisblackburn", "_blank"),
    }),
    {
      id: "contactAction",
      name: "Contact",
      shortcut: ["c"],
      keywords: "email hello",
      section: "Social",
      perform: () => window.open("mailto:lew.sh@hey.com", "_blank"),
    },
  ]

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      onReset={useQueryErrorResetBoundary().reset}
    >
      <Head>
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.51.0/mapbox-gl.css" rel="stylesheet" />
      </Head>
      <KBarProvider actions={actions}>
        <CommandBar />
        {/* Prevent kbar issues with spamming cmd+k */}
        <div className="absolute w-full min-h-screen">
          {getLayout(<Component {...pageProps} />)}
        </div>
      </KBarProvider>
    </ErrorBoundary>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return (
      <Layout>
        <LoginForm onSuccess={resetErrorBoundary} />
      </Layout>
    )
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
    )
  }
}

function CommandBar() {
  return (
    <KBarPortal>
      <KBarPositioner>
        <KBarAnimator className="w-full max-w-xl bg-gray-800 text-white rounded overflow-hidden">
          <KBarSearch className="p-4 text-sm w-full outline-none border-none bg-gray-800" />
          <RenderResults />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  )
}

function RenderResults() {
  const { results } = useMatches()

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="bg-gray-800 text-gray-500 text-sm" style={{ padding: "8px 16px" }}>
            {item}
          </div>
        ) : (
          <div
            className={cn("bg-gray-800 p-2", { "bg-gray-700": active })}
            style={{ padding: "12px 16px" }}
          >
            {item.name}
          </div>
        )
      }
    />
  )
}
