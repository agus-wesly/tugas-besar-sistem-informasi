import { Menu } from '@prisma/client'
import { create } from 'zustand'

type CartItem = {
  menu: Menu
  qty: number
}

type CartState = {
  items: CartItem[]
  addToCart: (item: Menu) => void
  removeFromCart: (itemId: number) => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addToCart: (newItem) =>
    set((state) => {
      const findItem = state.items.find((itm) => itm.menu.id === newItem.id)
      if (!findItem) {
        const newAddItem: CartItem = {
          menu: { ...newItem },
          qty: 1,
        }
        return {
          items: [...state.items, newAddItem],
        }
      }
      const filteredCart = state.items.filter(
        (itm) => itm.menu.id !== findItem.menu.id
      )
      return {
        items: [...filteredCart, { ...findItem, qty: findItem.qty + 1 }],
      }
    }),
  removeFromCart: (itemId) =>
    set((state) => {
      const findItem = state.items.find((itm) => itm.menu.id === itemId)
      if (!findItem) {
        return state
      }
      const filteredCart = state.items.filter((itm) => itm.menu.id !== itemId)
      if (findItem.qty > 1) {
        return {
          ...state,
          items: [
            ...filteredCart,
            {
              ...findItem,
              qty: findItem.qty - 1,
            },
          ],
        }
      }
      return {
        ...state,
        items: [...filteredCart],
      }
    }),
}))

export const getTotalCart = useCartStore((state) =>
  state.items.reduce((acc, curr) => acc + curr.qty, 0)
)
