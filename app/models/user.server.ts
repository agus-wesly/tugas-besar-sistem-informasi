import { prisma } from '~/lib/prisma'

export const query = {
  async getName(id: number) {
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    })

    return user?.nama
  },
}

export const mutation = {
  async register({ name, table }: { name: string; table: number }) {
    let user = await prisma.user.create({
      data: {
        nama: name,
        id_meja: table,
      },
    })
    return user
  },
}
