import { ActionArgs, LoaderArgs, json, redirect } from '@remix-run/node'
import { Form, Link, useLoaderData, useNavigation } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { model } from '~/models'
import { requireId } from '~/services/session.server'

export async function loader({ params, request }: LoaderArgs) {
  await requireId(request, undefined, true)
  const pesananId = params.id
  const pesanan = await model.pesan.query.getPesananById({
    id: Number(pesananId),
  })

  if (!pesanan) throw redirect('/admin')

  return json({
    pesanan,
  })
}

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData()
  const action = formData.get('_action') as string
  const id = Number(params.id)

  if (action === 'confirm') {
    await model.pesan.mutation.updatePesan({ status: 'COMPLETED', id })
  } else if (action === 'pay') {
    await model.pesan.mutation.updatePesan({ status: 'PAYED', id })
  } else if (action === 'reject') {
    await model.pesan.mutation.updatePesan({ status: 'REJECTED', id })
  }

  return redirect('/admin')
}

export default function OrderDetailAdmin() {
  const { pesanan } = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  const isSubmitting = navigation.state === 'submitting'

  return (
    <main>
      <div className="bg-maroon w-full p-8 py-4 flex items-center">
        <Link to={'/admin'}>
          <img src="/food-logo-fill.svg" className="w-[69px] h-[69px]" />
        </Link>

        <div className="space-y-1 text-white">
          <h3 className="font-bold">Warung makan Disny</h3>
          <p className="text-xs leading-[21px]">Makan enak gak harus mahal</p>
        </div>
      </div>

      <div className="container space-y-4 relative">
        <Link to={'/admin'} className="absolute top-0 left-4">
          <img src="/icons/arrow-left.svg" className="w-5 h-5" />
        </Link>
        <h3 className="font-bold text-lg text-center my-5">
          Pesanan P-{pesanan.id}
        </h3>

        {pesanan.detail_pesanan.map((itm) => (
          <div className="w-full flex items-center gap-8 border rounded-lg pr-2">
            <img src={itm.menu.url_gambar} className="w-36 h-32 object-cover" />

            <div className="space-y-1">
              <p className="text-lg font-semibold">{itm.menu.nama}</p>
              <p className="text-sm">Jmlh : {itm.jumlah}</p>
              <p className="text-sm">Meja {itm.pemesanan.user.id_meja}</p>
              <p className="text-sm font-bold">Rp.{itm.menu.harga}</p>
            </div>
          </div>
        ))}
      </div>
      {pesanan.status !== 'PAYED' ? (
        <div className="flex flex-col gap-5 container my-5">
          <Form method="post">
            <Button
              disabled={isSubmitting}
              name="_action"
              value={pesanan.status === 'COMPLETED' ? 'pay' : 'confirm'}
              className="bg-blue-500 w-full"
            >
              Konfirmasi{' '}
              {pesanan.status === 'COMPLETED' ? 'Pembayaran' : 'Pesanan'}
            </Button>
          </Form>
          <Form method="post">
            <Button
              disabled={isSubmitting}
              name="_action"
              value="reject"
              className="border-red w-full"
              variant={'outline'}
            >
              Tolak pesanan
            </Button>
          </Form>
        </div>
      ) : null}
    </main>
  )
}
