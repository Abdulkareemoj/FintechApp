import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/manager/statements')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/manager/statements"!</div>
}
