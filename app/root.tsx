import { cssBundleHref } from '@remix-run/css-bundle'
import type { LinksFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react'

import stylesheet from '~/tailwind.css'
import sansFontStyles from '@fontsource/plus-jakarta-sans/index.css'
import '@fontsource/plus-jakarta-sans/200.css'
import '@fontsource/plus-jakarta-sans/300.css'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/500.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/700.css'
import { PropsWithChildren } from 'react'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
  { rel: 'stylesheet', href: sansFontStyles },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

function Document({ children }: PropsWithChildren<{ title?: string }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="antialiased overflow-x-hidden max-w-md mx-auto relative">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    let message
    switch (error.status) {
      case 401:
        message = `Sorry, you can't access this page.`
        break
      case 404:
        message = `Sorry, this page is not available.`
        break
      default:
        throw new Error(error.data || error.statusText)
    }
    return (
      <Document title="Uh-oh!">
        <div>
          <h1>App Error</h1>
          <pre>{message}</pre>
        </div>
      </Document>
    )
  }

  return (
    <Document title="Uh-oh!">
      <div>
        <h1>App Error</h1>
        <p>Ada error nih :( Cobalah lakukan refresh</p>
      </div>
    </Document>
  )
}
