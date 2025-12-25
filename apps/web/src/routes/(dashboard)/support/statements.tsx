import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/support/statements')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/support/statements"!</div>
}
