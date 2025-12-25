import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/dashboard/cards')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/dashboard/cards"!</div>
}
