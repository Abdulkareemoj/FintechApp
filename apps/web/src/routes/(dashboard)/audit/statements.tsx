import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/audit/statements')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/audit/statements"!</div>
}
