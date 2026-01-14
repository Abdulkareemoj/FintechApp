
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/superadmin/overview')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/superadmin/overview"!</div>
}
