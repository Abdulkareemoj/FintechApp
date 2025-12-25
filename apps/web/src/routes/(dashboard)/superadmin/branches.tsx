import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/superadmin/branches')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/superadmin/branches"!</div>
}
