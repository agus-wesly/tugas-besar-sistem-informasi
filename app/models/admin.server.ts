import { forbidden } from 'remix-utils'
import { prisma } from '~/lib/prisma'

export const query = {
  async getByUsername(username: string) {
    return await prisma.admin.findUnique({
      where: {
        username,
      },
    })
  },
}

export const mutation = {
  async login({ username, password }: { username: string; password: string }) {
    const admin = await prisma.admin.findUnique({
      where: {
        username,
      },
    })
    if (!admin) {
      return { error: 'Username atau password salah' }
    }

    const isPasswordTrue = admin.password === password
    if (!isPasswordTrue) {
      return { error: 'Username atau password salah' }
    }

    return {
      id: admin.id,
    }
  },
}
