import { useCartContext } from '~/context/cart'
import type { CartItem } from '~/context/cart'
import { Button } from '~/components/ui/button'
import { LoaderFunctionArgs, json } from 'react-router'
import { requireId } from '~/services/session.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireId(request, '/')

  return json({
    userId,
  })
}

export default function DaftarPesan() {
  const { state } = useCartContext()
  const pesanan = state.items.sort((a, b) => a.menu.id - b.menu.id)
  const totalBayar = state.items.reduce(
    (acc, curr) => acc + curr.qty * curr.menu.harga,
    0
  )

  return (
    <div className="py-5 space-y-5 px-4">
      <p className="text-center text-lg font-bold">Daftar pesanan</p>
      {pesanan.length ? (
        pesanan.map((itm) => <ItemList {...itm} />)
      ) : (
        <p className="text-center">
          Daftar pesanan kosong, silahkan mulai melakukan pesanan
        </p>
      )}

      <div className="flex justify-between items-center pt-4">
        <div>
          <h3 className="text-lg font-semibold">Total Pesanan : </h3>
          <p>Rp.{totalBayar}</p>
        </div>

        <Button
          variant={'outline'}
          className="bg-blue-600 text-white font-semibold"
        >
          Pesan sekarang
        </Button>
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
