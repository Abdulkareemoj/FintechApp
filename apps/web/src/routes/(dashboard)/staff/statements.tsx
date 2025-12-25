import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/staff/statements')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/staff/statements"!</div>
}
