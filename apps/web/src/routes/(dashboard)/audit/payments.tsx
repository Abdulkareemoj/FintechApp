import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/audit/payments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/audit/payments"!</div>
}
