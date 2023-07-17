import { prisma } from '~/lib/prisma'

export const query = {
  async getAllMenu() {
    return await prisma.menu.findMany()
  },
  async getMenuByCategory({ tipe }: { tipe: 'MAKANAN' | 'MINUMAN' }) {
    return await prisma.menu.findMany({
      where: {
        tipe,
      },
    })
  },
  async getMenuByName({ name }: { name: string }) {
    return await prisma.menu.findMany({
      where: {
        nama: {
          contains: name,
        },
      },
    })
  },
  async getRecomendation() {
    return await prisma.menu.findFirst({
      where: {
        id: 33,
      },
    })
  },
}

export const mutation = {}
