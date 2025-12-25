import { createFileRoute } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/(dashboard)/accounts")({
  component: AccountsPage,
});

function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl tracking-tight">My Accounts</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Account
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Checking Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-extrabold text-4xl">$15,450.20</p>
            <p className="text-muted-foreground text-sm">
              Account ending in 1234
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Savings Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-extrabold text-4xl">$32,100.55</p>
            <p className="text-muted-foreground text-sm">
              Account ending in 5678
            </p>
          </CardContent>
        </Card>
        <Card className="flex items-center justify-center border-dashed">
          <Button className="flex h-full w-full flex-col py-8" variant="ghost">
            <PlusCircle className="mb-2 h-6 w-6" />
            Link External Account
          </Button>
        </Card>
      </div>
    </div>
  );
}
