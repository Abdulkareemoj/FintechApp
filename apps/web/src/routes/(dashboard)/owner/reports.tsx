import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/owner/reports')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/owner/reports"!</div>
}
