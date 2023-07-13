// app/services/auth.server.ts
import { Authenticator, AuthorizationError } from 'remix-auth'
import { sessionStorage } from '~/services/session.server'
import { FormStrategy } from 'remix-auth-form'

import { model } from '~/models'

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<AdminSession>(sessionStorage)

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    let username = form.get('username')?.toString()
    let password = form.get('password')?.toString()

    if (!username || !password) {
      throw new AuthorizationError('Tolong masukkkan username dan password')
    }

    let admin = await model.admin.query.getByUsername(username)

    if (!admin?.id) {
      throw new AuthorizationError('Username atau password salah ! ')
    }

    return {
      id: admin.id,
    }
  }),
  'admin-pass'
)
