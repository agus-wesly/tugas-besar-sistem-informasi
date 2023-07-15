import { Outlet } from '@remix-run/react'
import React from 'react'

export default function UserLayout() {
  return (
    <main className="">
      <div className="bg-maroon w-full p-8 py-4 flex items-center justify-between">
        <img src="/food-logo-fill.svg" className="w-[69px] h-[69px]" />
        <div className="space-y-1 text-white">
          <h3 className="font-bold">Warung makan Disny</h3>
          <p className="text-xs leading-[21px]">Makan enak gak harus mahal</p>
        </div>
        <button>
          <img src="/icons/cart.svg" className="w-6 h-6 text-white" />
        </button>
      </div>

      <div>
        <Outlet />
      </div>
    </main>
  )
}
