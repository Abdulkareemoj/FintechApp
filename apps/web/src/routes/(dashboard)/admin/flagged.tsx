import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/admin/flagged')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/admin/flagged"!</div>
}
