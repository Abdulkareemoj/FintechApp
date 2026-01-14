import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/owner/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/owner/"!</div>
}
