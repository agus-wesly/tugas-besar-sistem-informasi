import { Link, Outlet, useMatch } from '@remix-run/react'
import { useCartContext } from '~/context/cart'
import { cn } from '~/lib/utils'

export default function UserLayout() {
  const isInRoot = useMatch('/')
  const { state } = useCartContext()
  return (
    <main className="border min-h-screen">
      <div
        className={cn(
          'bg-maroon w-full p-8 py-4 flex items-center sticky top-0 z-[10]',
          {
            'justify-between': !isInRoot,
          }
        )}
      >
        <Link to={'/'}>
          <img src="/food-logo-fill.svg" className="w-[69px] h-[69px]" />
        </Link>
        <div className="space-y-1 text-white">
          <h3 className="font-bold">Warung makan Disny</h3>
          <p className="text-xs leading-[21px]">Makan enak gak harus mahal</p>
        </div>
        {!isInRoot ? (
          <Link to={'/daftarpesan'} className="relative">
            {state.items.length ? (
              <div className="absolute px-1 text-[9px] bg-white rounded-full right-0 -top-1 pointer-events-none">
                {state.items.length}
              </div>
            ) : null}
            <img src="/icons/cart.svg" className="w-6 h-6 text-white" />
          </Link>
        ) : null}
      </div>

      <Outlet />
    </main>
  )
}
