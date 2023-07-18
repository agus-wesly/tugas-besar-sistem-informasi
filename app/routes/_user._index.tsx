import { LoaderArgs, redirect } from '@remix-run/node'
import { useActionData, useSubmit } from '@remix-run/react'
import { ActionFunctionArgs, useNavigation } from 'react-router'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { createSession, getId } from '~/services/session.server'
import { useRef } from 'react'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { model } from '~/models'

export async function loader({ request }: LoaderArgs) {
  let userId = await getId(request)
  if (userId) {
    throw redirect('/pesan')
  }

  return null
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const name = formData.get('name')?.toString()
  let table = formData.get('table')?.toString()
  const orderType = formData.get('orderType')?.toString()

  if (!name || !orderType || !table) {
    return {
      error: 'Error : Tolong isi kamu terlebih dahulu !!',
    }
  }
  const parsedTable = Number(table)
  if (parsedTable < 1 || parsedTable > 6 || !parsedTable) {
    console.log('BBB')
    return {
      error: 'Error : Input meja tidak valid !!',
    }
  }
  const newUser = await model.user.mutation.register({
    name,
    table: parsedTable,
  })

  return await createSession(newUser.id, '/pesan')
}

export default function UserRegister() {
  const submit = useSubmit()
  const inputNameRef = useRef<HTMLInputElement>(null)
  const inputTableRef = useRef<HTMLInputElement>(null)
  const actionData = useActionData<{ error?: string }>()
  const navigation = useNavigation()

  const isSubmitting = navigation.state === 'submitting'

  function handleStartOrder(info: string) {
    const name = inputNameRef?.current?.value
    const table = inputTableRef?.current?.value
    submit(
      {
        name: name || '',
        table: table || null,
        orderType: info,
      },
      {
        method: 'post',
      }
    )
  }

  return (
    <div className="w-full bg-maroon px-4 pt-8 min-h-screen space-y-14 text-neutral-100">
      {isSubmitting ? (
        <div className="absolute inset-0 w-full h-full bg-black/50" />
      ) : null}
      {actionData?.error && !navigation.formData ? (
        <Alert variant="destructive" className="border-white text-white">
          <AlertDescription>{actionData.error}</AlertDescription>
        </Alert>
      ) : null}
      <div className="text-center flex flex-col gap-2">
        <Label className="text-lg" htmlFor="name">
          Siapa nama kamu ?
        </Label>
        <Input
          type="text"
          id="name"
          className="bg-transparent"
          ref={inputNameRef}
        />

        <Label className="text-lg mt-4" htmlFor="table">
          Nomor meja ? (1 - 6)
        </Label>
        <Input
          type="number"
          id="table"
          className="bg-transparent"
          min={'1'}
          max={'6'}
          defaultValue={'1'}
          ref={inputTableRef}
        />
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold">Pilih jenis pemesanan</h3>
        <div className="flex justify-evenly">
          <button onClick={() => handleStartOrder('dine-in')}>
            <img src="/Vector.svg" className="h-[89px]" />
            <p className="mt-4">Dine in</p>
          </button>
          <button disabled className="cursor-not-allowed opacity-70">
            <img src="/Vector(1).svg" className="h-[89px]" />
            <p className="mt-4">Take Away</p>
          </button>
        </div>
      </div>
    </div>
  )
}
