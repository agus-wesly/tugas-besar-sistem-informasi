import { LoaderArgs, json } from '@remix-run/node'
import { requireId } from '~/services/session.server'

export async function loader({ request }: LoaderArgs) {
  const adminId = await requireId(request, undefined, true)

  return json({ adminId })
}

export default function Dashboard() {
  return <div className="bg-blue-200">Dashboard</div>
}
