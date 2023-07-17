import { Menu } from '@prisma/client'
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from 'react'

export type CartItem = {
  menu: Menu
  qty: number
}

type CartState = {
  items: CartItem[]
}

type Action =
  | {
      type: 'INCREASE'
      payload: Menu
    }
  | {
      type: 'DECREASE'
      payload: number
    }

export const cartContext = createContext<{
  state: CartState
  dispatch: Dispatch<Action>
}>({
  state: {
    items: [],
  },
  dispatch: () => {},
})

const reducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case 'INCREASE': {
      const findItem = state.items.find(
        (itm) => itm.menu.id === action.payload.id
      )
      if (!findItem) {
        const newAddItem: CartItem = {
          menu: { ...action.payload },
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
        items: [{ ...findItem, qty: findItem.qty + 1 }, ...filteredCart],
      }
    }
    case 'DECREASE': {
      const findItem = state.items.find((itm) => itm.menu.id === action.payload)
      if (!findItem) {
        return state
      }
      const filteredCart = state.items.filter(
        (itm) => itm.menu.id !== action.payload
      )
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
    }
    default: {
      return state
    }
  }
}

export default function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
  })

  return (
    <cartContext.Provider value={{ state, dispatch }}>
      {children}
    </cartContext.Provider>
  )
}

export function useCartContext() {
  return useContext(cartContext)
}
