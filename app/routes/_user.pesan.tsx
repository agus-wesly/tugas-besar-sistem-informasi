import { ActionArgs, LoaderArgs, json, redirect } from '@remix-run/node'
import { Form, Outlet, useLoaderData } from '@remix-run/react'
import { Input } from '~/components/ui/input'
import { model } from '~/models'
import { requireId } from '~/services/session.server'

export async function loader({ request }: LoaderArgs) {
  const userId = await requireId(request, '/')
  const name = await model.user.query.getName(userId)

  return json({
    name,
  })
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const search = formData.get('search') as string

  if (!search) return null

  return redirect(`/pesan/search?q=${search}`)
}

export default function UserPesan() {
  const { name } = useLoaderData<typeof loader>()

  return (
    <div className="space-y-5 pt-6 pb-8">
      <p className="text-center text-xl">
        Selamat Datang,{' '}
        <span className="capitalize font-bold">{name ?? ''}</span>
      </p>
      <p className="text-center text-lg">Silahkan pilih menu sesukamu</p>

      <div className="relative px-4">
        <Form method="post">
          <Input name="search" placeholder="Pilih makan" className="h-10" />
          <button className="absolute right-0 top-0  w-10 h-10 mr-4">
            <img src="/icons/search.svg" className="w-6 h-6" />
          </button>
        </Form>
      </div>

      <Outlet />
    </div>
  )
}
