import { createCookieSessionStorage, redirect } from '@remix-run/node'

const sessionSecret = process.env.AUTH_SECRET
if (!sessionSecret) {
  throw new Error('AUTH_SECRET must be set')
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'admin_session',

    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export async function createAdminSession(adminId: number, redirectTo: string) {
  const session = await storage.getSession()
  session.set('adminId', adminId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}

function getAdminSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'))
}

export async function getAdminId(request: Request) {
  const session = await getAdminSession(request)
  const adminId = session.get('adminId')
  if (!adminId || typeof adminId !== 'number') {
    return null
  }
  return adminId
}

export async function requireAdminId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getAdminSession(request)
  const adminId = session.get('adminId')
  if (!adminId || typeof adminId !== 'number') {
    console.log('error1')
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }
  return adminId
}
