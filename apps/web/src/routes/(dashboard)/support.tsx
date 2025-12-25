import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/(dashboard)/support")({
  component: SupportPage,
});

function SupportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl tracking-tight">Customer Support</h1>
        <Button variant="outline">
          <LifeBuoy className="mr-2 h-4 w-4" />
          Help Center
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              New Support Ticket
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Subject" />
            <Textarea placeholder="Describe your issue in detail..." rows={6} />
            <Button className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Submit Ticket
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b pb-2">
              <p className="font-medium">Transfer failed (ID: #1029)</p>
              <p className="text-muted-foreground text-sm">
                Status: Pending Review
              </p>
            </div>
            <div className="border-b pb-2">
              <p className="font-medium">Question about fees</p>
              <p className="text-muted-foreground text-sm">Status: Closed</p>
            </div>
            <div className="border-b pb-2">
              <p className="font-medium">Account verification issue</p>
              <p className="text-muted-foreground text-sm">
                Status: In Progress
              </p>
            </div>
            <Button className="p-0" variant="link">
              View All Tickets
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
