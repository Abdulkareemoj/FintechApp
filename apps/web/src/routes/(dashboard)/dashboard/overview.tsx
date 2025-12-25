import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/dashboard/overview')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/dashboard/overview"!</div>
}
