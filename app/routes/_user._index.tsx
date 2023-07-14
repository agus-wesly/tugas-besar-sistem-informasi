import React from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export default function UserComponent() {
  return (
    <div className="space-y-5">
      <p className="text-center text-xl">Silahkan pilih menu sesukamu</p>

      <div className="relative">
        <Input placeholder="Pilih makan" className="h-10" />
        <button className="absolute right-0 top-0  w-10 h-10">
          <img src="/icons/search.svg" className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-8">
        <div className="py-8 px-4 border rounded-md">
          <h2 className="font-bold text-xl">Terlaris</h2>
          <div className="flex justify-between pt-2 gap-4">
            <div className="flex justify-between flex-col">
              <h4 className="text-lg font-bold">NASI GILA</h4>
              <p className="text-sm font-medium">
                Hanya
                <br />
                Rp.14000/Porsi
              </p>
              <Button className="py-2 px-6">Pesan sekarang</Button>
            </div>
            <img
              src="https://kurio-img.kurioapps.com/21/08/31/13bae191-984d-4029-b3cf-83116c0322be.jpe"
              className="w-[163px] h-32"
            />
          </div>
        </div>

        <div className="px-4">
          <h2 className="font-bold text-xl pb-2">Makanan</h2>
          <div className="flex overflow-x-scroll snap-x pt-2 gap-6 snap-mandatory">
            <FoodCard />
            <FoodCard />
            <FoodCard />
            <FoodCard />
          </div>
        </div>

        <div className="px-4">
          <h2 className="font-bold text-xl pb-2">Minuman</h2>
          <div className="flex overflow-x-scroll pt-2 gap-4">
            <FoodCard />
            <FoodCard />
            <FoodCard />
            <FoodCard />
          </div>
        </div>
      </div>
    </div>
  )
}

function FoodCard() {
  return (
    <div className="text-center border shadow-sm rounded-md space-y-2 snap-center">
      <p className="font-semibold">Nasi Gila</p>

      <img
        src="https://kurio-img.kurioapps.com/21/08/31/13bae191-984d-4029-b3cf-83116c0322be.jpe"
        className="w-[128px] h-[92px] object-cover"
      />

      <p className="text-xs font-medium px-2">Rp.14.000/porsi</p>

      <Button className="p-0 h-7 w-full">Pesan</Button>
    </div>
  )
}
