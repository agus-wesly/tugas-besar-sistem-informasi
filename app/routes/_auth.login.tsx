import { ActionArgs, json } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { forbidden } from 'remix-utils'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
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
    <div className="pb-20 relative overflow-hidden border">
      <div className="w-[642px] h-[676px] bg-maroon absolute -top-1/2 border-[10px] border-[#940034] -left-1/2 rounded-full translate-x-[20%] z-[-1]" />

      <div className="flex flex-col justify-center items-center p-4 text-white">
        <img
          src="/food-logo-fill.svg"
          alt="food-logo"
          className="w-[145px] h-[145px] object-contain"
        />

        <h1 className="text-xl font-bold leading-[39px]">Warung Makan Disny</h1>
        <p className="leading-[27.3px]">Makan enak gak harus mahal!</p>
      </div>

      <Form>
        <fieldset className="mt-40 container space-y-5">
          {' '}
          <div className="grid w-full items-center gap-2">
            {' '}
            <Label htmlFor="username" className="text-xs">
              {' '}
              Username{' '}
            </Label>{' '}
            <Input
              type="email"
              id="username"
              placeholder="Username"
              className="py-7"
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="password" className="text-xs">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              className="py-7"
            />
          </div>
          <Button className="w-full hover:bg-[#d61e1e]">Login</Button>
        </fieldset>
      </Form>
    </div>
  )
}
