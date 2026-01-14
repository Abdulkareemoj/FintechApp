import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/owner/overview')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/owner/overview"!</div>
}
