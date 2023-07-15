import { createCookieSessionStorage, redirect } from '@remix-run/node'

const sessionSecret = process.env.AUTH_SECRET

if (!sessionSecret) {
  throw new Error('AUTH_SECRET must be set')
}

function createCookie(isAdmin = false) {
  return createCookieSessionStorage({
    cookie: {
      name: isAdmin ? 'admin_session' : 'user_session',

      secure: process.env.NODE_ENV === 'production',
      secrets: [sessionSecret!],
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
    },
  })
}

const adminSession = createCookie(true)
const userSession = createCookie(false)

export async function createSession(
  id: number,
  redirectTo: string,
  isAdmin = false
) {
  const currentSession = isAdmin ? adminSession : userSession

  const session = await currentSession.getSession()
  session.set(isAdmin ? 'adminId' : 'userId', id)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await currentSession.commitSession(session),
    },
  })
}

function getSession(request: Request, isAdmin = false) {
  const currentSession = isAdmin ? adminSession : userSession
  return currentSession.getSession(request.headers.get('Cookie'))
}

export async function getId(request: Request, isAdmin = false) {
  const session = await getSession(request, isAdmin)
  const id = session.get(isAdmin ? 'adminId' : 'userId')
  if (!id || typeof id !== 'number') {
    return null
  }
  return id
}

export async function requireId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
  isAdmin = false
) {
  const session = await getSession(request, isAdmin)
  const id = session.get(isAdmin ? 'adminId' : 'userId')
  if (!id || typeof id !== 'number') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    if (isAdmin) {
      throw redirect(`/admin/login?${searchParams}`)
    }
    throw redirect(`/?${searchParams}`)
  }
  return id
}
