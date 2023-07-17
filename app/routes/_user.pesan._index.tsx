import { Menu } from '@prisma/client'
import { LoaderArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Dispatch, useContext } from 'react'
import { Button } from '~/components/ui/button'
import { useCartContext } from '~/context/cart'
import { model } from '~/models'

export async function loader({ request }: LoaderArgs) {
  const makanan = await model.menu.query.getMenuByCategory({
    tipe: 'MAKANAN',
  })

  const minuman = await model.menu.query.getMenuByCategory({
    tipe: 'MINUMAN',
  })

  return json({
    makanan,
    minuman,
  })
}

export default function Index() {
  const { makanan, minuman } = useLoaderData<typeof loader>()
  const { dispatch } = useCartContext()

  const makananTop = makanan.find((itm) => itm.nama === 'Nasi Gila')

  return (
    <div className="space-y-8">
      <div className="py-8 px-4 rounded-md">
        <h2 className="font-bold text-xl">Terlaris</h2>
        <div className="flex justify-between pt-2 gap-4">
          <div className="flex justify-between flex-col">
            <h4 className="text-lg font-bold">{makananTop?.nama}</h4>
            <p className="text-sm font-medium">
              Hanya
              <br />
              {makananTop?.harga}/Porsi
            </p>
            <Button
              onClick={() =>
                dispatch({ type: 'INCREASE', payload: makananTop! })
              }
              className="py-2 px-6"
            >
              Pesan sekarang
            </Button>
          </div>
          <img src={makananTop?.url_gambar} className="w-[163px] h-32" />
        </div>
      </div>

      <div className="px-4">
        <h2 className="font-bold text-xl pb-2">Makanan</h2>{' '}
        <div className="flex overflow-x-scroll snap-x pt-2 gap-6 snap-mandatory">
          {makanan.map((itm) => (
            <FoodCard {...itm} key={itm.id} dispatch={dispatch} />
          ))}
        </div>
      </div>

      <div className="px-4">
        <h2 className="font-bold text-xl pb-2">Minuman</h2>
        <div className="flex overflow-x-scroll pt-2 gap-4">
          {minuman.map((itm) => (
            <FoodCard {...itm} key={itm.id} dispatch={dispatch} />
          ))}
        </div>
      </div>
    </div>
  )
}

function FoodCard(
  props: Menu & {
    dispatch: Dispatch<any>
  }
) {
  return (
    <div className="text-center border shadow-sm rounded-md space-y-2 snap-center w-40 flex-none flex flex-col justify-between py-4">
      <p className="font-semibold">{props.nama}</p>

      <img src={props.url_gambar} className="w-full h-[81px] object-cover" />

      <div className="space-y-2">
        <p className="text-sm font-medium px-2">Rp.{props.harga}</p>

        <Button
          onClick={() => props.dispatch({ type: 'INCREASE', payload: props })}
          className="p-0 h-7 w-full"
        >
          Tambah ke list
        </Button>
      </div>
    </div>
  )
}
