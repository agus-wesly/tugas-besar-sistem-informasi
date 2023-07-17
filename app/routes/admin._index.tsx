import { LoaderArgs, json } from '@remix-run/node'
import { requireId } from '~/services/session.server'
import { Link, useLoaderData, useRevalidator } from '@remix-run/react'
import { model } from '~/models'
import { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import type { ListPesanan } from '~/models/pesan.server'

export async function loader({ request }: LoaderArgs) {
  const adminId = await requireId(request, undefined, true)

  const allPesanan = await model.pesan.query.getAllPesanan()

  const pesananBaru = allPesanan.filter((itm) => itm.status == 'PROCESSING')
  const pesananDibayar = allPesanan.filter((itm) => itm.status == 'PAYED')
  const pesananDikonfirmasi = allPesanan.filter(
    (itm) => itm.status == 'COMPLETED'
  )

  return json({ pesananBaru, adminId, pesananDibayar, pesananDikonfirmasi })
}

export default function Dashboard() {
  const { pesananBaru, pesananDibayar, pesananDikonfirmasi } =
    useLoaderData<typeof loader>()
  const { revalidate } = useRevalidator()

  useEffect(() => {
    const interval = setInterval(() => {
      revalidate()
    }, 7000)

    return () => {
      clearInterval(interval)
    }
  }, [])

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

      <div className="container py-5 space-y-5">
        <h3 className="text-center text-xl font-bold">List pesanan : </h3>

        <Tabs defaultValue="ongoing" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ongoing">Belum dikonfirmasi</TabsTrigger>
            <TabsTrigger value="confirmed">Terkonfirmasi</TabsTrigger>
            <TabsTrigger value="payed">Telah dibayar</TabsTrigger>
          </TabsList>
          <TabsContent value="ongoing" className="space-y-3">
            {pesananBaru.length ? (
              pesananBaru.map((itm) => <ListPesanan itm={itm} />)
            ) : (
              <p className="text-center">Belum ada pesanan datang</p>
            )}
          </TabsContent>
          <TabsContent value="confirmed" className="space-y-3">
            {pesananDikonfirmasi.length ? (
              pesananDikonfirmasi.map((itm) => <ListPesanan itm={itm} />)
            ) : (
              <p className="text-center">Belum ada pesanan datang</p>
            )}
          </TabsContent>
          <TabsContent value="payed" className="space-y-3">
            {pesananDibayar.length ? (
              pesananDibayar.map((itm) => <ListPesanan itm={itm} />)
            ) : (
              <p className="text-center">Belum ada pesanan datang</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function ListPesanan({ itm }: { itm: any }) {
  return (
    <Link
      to={`/admin/order-detail/${itm.id}`}
      className="w-full flex items-center gap-8 border rounded-lg hover:bg-muted"
    >
      <img
        src={itm.detail_pesanan[0].menu.url_gambar}
        className="w-36 h-32 object-cover"
      />

      <div className="space-y-1">
        <p className="text-lg font-semibold">P-{itm.id}</p>
        <p className="text-sm">Meja {itm.user.id_meja}</p>
        <div className="flex items-center gap-2">
          <img src="/icons/person.svg" className="w-5 h-5 object-contain" />
          <p className="text-sm text-muted-foreground capitalize">
            {itm.user.nama}
          </p>
        </div>
      </div>
    </Link>
  )
}
