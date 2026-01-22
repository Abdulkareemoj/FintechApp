import { createFileRoute } from "@tanstack/react-router";
import AdminLayout from "@/layout/AdminLayout";

export const Route = createFileRoute("/(dashboard)/admin/support")({
  component: AdminSupport,
});

function AdminSupport() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <main className="mx-auto space-y-8 px-6 py-8">{/* Header */}</main>
      </div>
    </AdminLayout>
  );
}
