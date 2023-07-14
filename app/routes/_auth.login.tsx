import { ActionArgs, LoaderArgs, json, redirect } from '@remix-run/node'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { badRequest } from 'remix-utils'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { model } from '~/models'
import { createAdminSession, getAdminId } from '~/services/session.server'

export async function loader({ request }: LoaderArgs) {
  const adminId = await getAdminId(request)
  if (adminId) {
    return redirect('/dashboard')
  }
  return adminId
}

export async function action({ request }: ActionArgs) {
  try {
    const formData = await request.formData()

    const username = formData.get('username')?.toString()
    const password = formData.get('password')?.toString()

    if (!username || !password) {
      return badRequest({ error: 'Username dan password tidak boleh kosong' })
    }

    const { id, error } = await model.admin.mutation.login({
      username,
      password,
    })

    if (error || !id)
      return badRequest({
        error,
      })

    const getRedirect =
      new URLSearchParams(request.url).get('redirectTo') || 'dashboard'

    return await createAdminSession(id, `/${getRedirect}`)
  } catch (error) {
    return null
  }
}

export default function Login() {
  const actionData = useActionData<{ error?: string; id?: string }>()
  const navigation = useNavigation()

  const isSubmitting = navigation.state === 'submitting'

  return (
    <div className="pb-20 relative overflow-hidden border">
      <div className="w-[642px] h-[676px] bg-maroon absolute -top-[40%] border-[10px] border-[#940034] -left-1/4 -translate-x-4 rounded-full z-[-1]" />

      <div className="flex flex-col justify-center items-center p-4 text-white mb-44">
        <img
          src="/food-logo-fill.svg"
          alt="food-logo"
          className="w-[145px] h-[145px] object-contain"
        />

        <h1 className="text-xl font-bold leading-[39px]">Warung Makan Disny</h1>
        <p className="leading-[27.3px]">Makan enak gak harus mahal!</p>
      </div>

      <div className="container min-h-[344px]">
        {actionData?.error && !isSubmitting ? (
          <Alert variant="destructive" className="mb-5">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{actionData.error}</AlertDescription>
          </Alert>
        ) : null}

        <Form method="post">
          <fieldset className="space-y-5" disabled={isSubmitting}>
            {' '}
            <div className="grid w-full items-center gap-2">
              {' '}
              <Label htmlFor="username" className="text-xs">
                {' '}
                Username{' '}
              </Label>{' '}
              <Input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                className="py-7"
                required
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="password" className="text-xs">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className="py-7"
                required
              />
            </div>
            <Button type="submit" className="w-full hover:bg-[#d61e1e]">
              Login
            </Button>
          </fieldset>
        </Form>
      </div>
    </div>
  )
}
