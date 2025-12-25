import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/audit/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/audit/settings"!</div>
}
