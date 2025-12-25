import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/staff/support')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/staff/support"!</div>
}
