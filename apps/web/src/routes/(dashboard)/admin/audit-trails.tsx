import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/admin/audit-trails')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/admin/audit-trails"!</div>
}
