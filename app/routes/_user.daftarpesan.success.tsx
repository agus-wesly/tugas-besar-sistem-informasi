import { LoaderArgs, redirect } from '@remix-run/node'
import { useLoaderData, useRevalidator } from '@remix-run/react'
import { useEffect } from 'react'
import { useCartContext } from '~/context/cart'
import { model } from '~/models'
import { requireId } from '~/services/session.server'

export async function loader({ request }: LoaderArgs) {
  await requireId(request, '/')
  const pesananId = new URL(request.url).searchParams.get('idPesan')

  if (!pesananId) throw redirect('/pesan')

  const pesanan = await model.pesan.query.getPesananById({
    id: Number(pesananId),
  })

  if (!pesanan) throw redirect('/')

  return {
    pesanan,
  }
}

export default function PemesananSukses() {
  const { pesanan } = useLoaderData<typeof loader>()
  const { dispatch } = useCartContext()
  const { revalidate } = useRevalidator()

  useEffect(() => {
    dispatch({ type: 'RESET' })

    const interval = setInterval(() => {
      revalidate()
    }, 7000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const totalBayar = pesanan.detail_pesanan.reduce(
    (acc, curr) => acc + curr.jumlah * curr.menu.harga,
    0
  )

  let content

  if (pesanan.status === 'PROCESSING') {
    content = (
      <>
        <h3 className="text-lg font-bold text-center">Pesanan terkirim</h3>
        <div className="flex flex-col items-center">
          <p className="text-muted-foreground">
            Harap menunggu konfirmasi petugas
          </p>
          <p className="text-muted-foreground">Jangan tutup tab ini !</p>

          <img src="/icons/danger.svg" className="mt-10 h-20 object-contain" />
        </div>
      </>
    )
  }
  if (pesanan.status === 'REJECTED') {
    content = (
      <>
        <h3 className="text-lg font-bold text-center">Pesanan ditolak</h3>
        <div className="flex flex-col items-center">
          <p className="text-muted-foreground">
            Maaf pesanan kamu ditolak, dikarenakan menu mungkin tidak tersedia.
          </p>
          <p className="text-muted-foreground">
            Silahkan lakukan pemesanan ulang
          </p>

          <img src="/icons/danger.svg" className="mt-10 h-20 object-contain" />
        </div>
      </>
    )
  }

  if (pesanan.status === 'COMPLETED') {
    content = (
      <>
        <p className="font-bold text-xl">Pesanan diterima !</p>
        <p className="text-xl text-muted-foreground">
          Silahkan berikan Kode pemesanan ini kepada kasir untuk melakukan
          proses pembayaran
        </p>

        <p className="text-4xl font-bold">P{pesanan.id}</p>

        <div className="mt-5">
          <h3 className="text-lg font-bold mb-5">Rincian pesanan</h3>

          <div className="space-y-5">
            {pesanan.detail_pesanan.map((itm) => (
              <div
                key={itm.id}
                className="w-full flex items-center gap-8 border rounded-lg"
              >
                <img
                  src={itm.menu.url_gambar}
                  className="w-32 aspect-square object-cover"
                />

                <div className="text-left">
                  <h3 className="text-lg font-bold">{itm.menu.nama}</h3>
                  <p>Rp.{itm.menu.harga}</p>
                </div>
              </div>
            ))}

            <p className="text-xl font-semibold">Total : {totalBayar}</p>
          </div>
        </div>
      </>
    )
  }

  if (pesanan.status === 'PAYED') {
    content = (
      <p className="text-center">
        Pesanan kamu sedang disiapkan. Harap menunggu dan selamat menikmati
        makanan.
      </p>
    )
  }

  return (
    <div className="py-10 container text-center flex flex-col gap-4">
      <h3 className="text-center text-lg font-bold">Status pesanan : </h3>
      {content}
    </div>
  )
}
