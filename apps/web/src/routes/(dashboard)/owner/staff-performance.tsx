import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/owner/staff-performance')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/owner/staff-performance"!</div>
}
