import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/dashboard/transactions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/dashboard/transactions"!</div>
}
