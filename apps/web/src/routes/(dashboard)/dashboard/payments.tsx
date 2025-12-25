import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/dashboard/payments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/dashboard/payments"!</div>
}
