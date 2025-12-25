import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/audit/support')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/audit/support"!</div>
}
