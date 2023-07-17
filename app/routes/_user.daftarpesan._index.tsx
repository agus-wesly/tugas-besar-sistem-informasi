import { useCartContext } from '~/context/cart'
import type { CartItem } from '~/context/cart'
import { Button } from '~/components/ui/button'
import { LoaderFunctionArgs, json } from 'react-router'
import { requireId } from '~/services/session.server'
import { ActionArgs, redirect } from '@remix-run/node'
import { useLoaderData, useSubmit, useNavigation } from '@remix-run/react'
import { model } from '~/models'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireId(request, '/')

  return {
    userId,
  }
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const pesanan = formData.get('pesanan') as string
  const totalBayar = formData.get('totalBayar') as string
  const userId = formData.get('userId') as string

  const parsedPesanan = JSON.parse(pesanan) as CartItem[]

  const resp = await model.pesan.mutation.createPesanan({
    userId: Number(userId),
    items: parsedPesanan,
    totalHarga: Number(totalBayar),
  })

  return redirect(`/daftarpesan/success?idPesan=${resp.id}`)
}

export default function DaftarPesan() {
  const { state } = useCartContext()
  const { userId } = useLoaderData<typeof loader>()
  const submit = useSubmit()
  const pesanan = state.items.sort((a, b) => a.menu.id - b.menu.id)
  const totalBayar = state.items.reduce(
    (acc, curr) => acc + curr.qty * curr.menu.harga,
    0
  )

  const navigation = useNavigation()

  const isSubmitting = navigation.state === 'submitting'

  function handlePesan() {
    submit(
      {
        pesanan: JSON.stringify(state.items),
        totalBayar,
        userId,
      },
      {
        method: 'post',
      }
    )
  }

  return (
    <div className="py-5 space-y-5 px-4 min-h-[87vh] flex flex-col justify-between">
      {isSubmitting ? (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <img
            src="/icons/spinner.svg"
            className="w-6 h-6 animate-spin fill-white"
          />
        </div>
      ) : null}

      <div className="space-y-5">
        <p className="text-center text-lg font-bold mb-5">Daftar pesanan</p>
        {pesanan.length ? (
          pesanan.map((itm) => <ItemList key={itm.menu.id} {...itm} />)
        ) : (
          <p className="text-center">
            Daftar pesanan kosong, silahkan mulai melakukan pesanan
          </p>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 mt-full">
        <div>
          <h3 className="text-lg font-semibold">Total Pesanan : </h3>
          <p>Rp.{totalBayar}</p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={!pesanan.length}
              variant={'outline'}
              className="bg-blue-600 text-white font-semibold"
            >
              Pesan sekarang
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Pesan</AlertDialogTitle>
              <AlertDialogDescription>
                Yakin ingin memesan ? Pesanan yang sudah terkirim tidak dapat
                dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handlePesan}>Yakin</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

function ItemList({ menu, qty }: CartItem) {
  const { dispatch } = useCartContext()

  return (
    <div className="w-full flex items-center gap-8 border rounded-lg">
      <img src={menu.url_gambar} className="w-32 aspect-square object-cover" />

      <div>
        <h3 className="text-lg font-bold">{menu.nama}</h3>
        <p>Rp.{menu.harga}</p>

        <p>Jumlah pesan: {qty}</p>

        <Button
          onClick={() => dispatch({ type: 'INCREASE', payload: menu })}
          className="py-0 mt-2 mr-2 bg-blue-500"
        >
          Tambah
        </Button>
        <Button
          onClick={() => dispatch({ type: 'DECREASE', payload: menu.id })}
          className="py-0 mt-2"
          variant={'destructive'}
        >
          Kurangi
        </Button>
      </div>
    </div>
  )
}
