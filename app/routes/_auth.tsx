import { LoaderArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { authenticator } from '~/services/auth.server'

export async function loader({ request }: LoaderArgs) {
  authenticator.isAuthenticated(request, {
    successRedirect: '/dashboard',
  })

  return null
}

export default function AuthLayout() {
  return <Outlet />
}
