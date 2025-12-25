import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/admin/support')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/admin/support"!</div>
}
