import { prisma } from '~/lib/prisma'
import type { CartItem } from '~/context/cart'

export const query = {
  async getAllPesanan() {
    return await prisma.pemesanan.findMany({
      include: {
        detail_pesanan: {
          include: {
            menu: true,
          },
        },
        user: {
          include: {
            meja: true,
          },
        },
      },
      orderBy: {
        waktu_pesan: 'desc',
      },
      where: {
        status: 'PROCESSING',
      },
    })
  },

  async getPesananById({ id }: { id: number }) {
    return await prisma.pemesanan.findFirst({
      where: {
        id,
      },
      include: {
        detail_pesanan: {
          include: {
            menu: true,
          },
        },
      },
    })
  },
}

export const mutation = {
  async createPesanan({
    userId,
    items,
    totalHarga,
  }: {
    userId: number
    items: CartItem[]
    totalHarga: number
  }) {
    const detailPesanan = items.map((itm) => ({
      id_menu: itm.menu.id,
      jumlah: itm.qty,
    }))

    return await prisma.pemesanan.create({
      data: {
        status: 'PROCESSING',
        user_id: userId,
        detail_pesanan: {
          createMany: {
            data: detailPesanan,
          },
        },
        total_harga: totalHarga,
      },
    })
  },

  async updatePesan({
    status,
    id,
  }: {
    status: 'COMPLETED' | 'REJECTED'
    id: number
  }) {
    return prisma.pemesanan.update({
      where: {
        id,
      },
      data: {
        status,
      },
    })
  },
}
