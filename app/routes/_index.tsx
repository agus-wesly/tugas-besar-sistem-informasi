import type { V2_MetaFunction } from '@remix-run/node'
import { Button } from '~/components/ui/button'

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Warung makan Disny' },
    {
      name: 'description',
      content:
        'Selamat datang di warung makan Disny, silahkan mulai lakukan pemesanan anda !',
    },
  ]
}

export default function Index() {
  return (
    <div className="text-green-500 text-xl">
      <p className="text-muted-foreground">Hello world</p>
      <Button>Click me</Button>
    </div>
  )
}
