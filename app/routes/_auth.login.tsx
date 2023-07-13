import { ActionArgs, json } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { forbidden } from 'remix-utils'
import { model } from '~/models'
import { authenticator } from '~/services/auth.server'

export async function action({ request }: ActionArgs) {
  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()

  const username = formData.get('username')?.toString()
  const password = formData.get('password')?.toString()

  if (!username || !password) {
    return forbidden({ error: 'Username dan password tidak boleh kosong' })
  }

  const { id, error } = await model.admin.mutation.login({ username, password })

  if (error)
    return json({
      error,
    })

  authenticator.authenticate('admin-pass', clonedRequest, {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
  })

  return json({
    id,
  })
}

export default function Login() {
  return (
    <Form method="post">
      <input type="username" name="username" required />
      <input
        type="password"
        name="password"
        autoComplete="current-password"
        required
      />
      <button>Sign In</button>
    </Form>
  )
}
