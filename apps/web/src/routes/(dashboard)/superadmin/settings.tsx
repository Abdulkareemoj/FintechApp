import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/superadmin/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/superadmin/settings"!</div>
}
