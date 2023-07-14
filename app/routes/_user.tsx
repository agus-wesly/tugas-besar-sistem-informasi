import { Outlet } from '@remix-run/react'
import React from 'react'

export default function UserLayout() {
  return (
    <main className="">
      <div className="bg-maroon w-full p-8 pb-4 flex items-center ">
        <img src="/food-logo-fill.svg" className="w-[69px] h-[69px]" />

        <div className="space-y-1 text-white">
          <h3 className="font-bold">Warung makan Disny</h3>
          <p className="text-xs leading-[21px]">Makan enak gak harus mahal</p>
        </div>
      </div>

      <div className="container py-5">
        <Outlet />
      </div>
    </main>
  )
}
