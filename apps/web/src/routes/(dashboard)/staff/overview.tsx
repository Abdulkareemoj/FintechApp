import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/staff/overview')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/staff/overview"!</div>
}
