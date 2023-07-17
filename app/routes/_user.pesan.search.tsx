import { Menu } from '@prisma/client'
import { LoaderArgs, json } from '@remix-run/node'
import { useLoaderData, useNavigation } from '@remix-run/react'
import { model } from '~/models'
import { Button } from '~/components/ui/button'
import { useCartContext } from '~/context/cart'

export async function loader({ request }: LoaderArgs) {
  const query = new URL(request.url).searchParams.get('q')

  const menus = await model.menu.query.getMenuByName({
    name: query!,
  })

  return json({
    menus,
  })
}

export default function Search() {
  const { menus } = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  const isLoading = navigation.state !== 'idle'

  return (
    <div className="container space-y-4">
      {menus.length ? (
        menus.map((itm) => <MenuCard {...itm} />)
      ) : isLoading ? (
        <p className="text-center font-semibold">Loading...</p>
      ) : (
        <p className="text-center font-semibold">
          Menu yang kamu cari belum ada nih :(
        </p>
      )}
    </div>
  )
}

function MenuCard(props: Menu) {
  const { dispatch } = useCartContext()
  return (
    <div className="w-full flex items-center gap-8 border rounded-lg">
      <img src={props.url_gambar} className="w-32 aspect-square object-cover" />

      <div>
        <h3 className="text-lg font-bold">{props.nama}</h3>
        <p>Rp.{props.harga}</p>

        <Button
          onClick={() => dispatch({ type: 'INCREASE', payload: props })}
          className="py-0 mt-2"
        >
          Tambah ke list
        </Button>
      </div>
    </div>
  )
}
