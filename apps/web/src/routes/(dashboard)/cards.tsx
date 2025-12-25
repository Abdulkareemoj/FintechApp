import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Lock, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/(dashboard)/cards")({
  component: CardsPage,
});

const cardData = [
  {
    id: 1,
    type: "Visa Debit",
    lastFour: "4567",
    status: "Active",
    balance: 15_450.2,
  },
  {
    id: 2,
    type: "Mastercard Credit",
    lastFour: "9012",
    status: "Frozen",
    balance: -1200.0,
  },
];

function CardDisplay({ card }: { card: (typeof cardData)[0] }) {
  return (
    <Card className="flex h-full flex-col justify-between p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl">{card.type}</CardTitle>
          <p className="text-muted-foreground text-sm">
            Card ending in {card.lastFour}
          </p>
        </div>
        <CreditCard className="h-8 w-8 text-primary" />
      </div>
      <div className="mt-6">
        <p className="text-muted-foreground text-sm">Current Balance</p>
        <p
          className={`font-bold text-3xl ${card.balance < 0 ? "text-destructive" : "text-foreground"}`}
        >
          {card.balance.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      </div>
      <div className="mt-6 flex gap-2">
        <Button className="flex-1" size="sm" variant="outline">
          <Lock className="mr-2 h-4 w-4" />
          {card.status === "Active" ? "Freeze" : "Unfreeze"}
        </Button>
        <Button className="flex-1" size="sm" variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Terminate
        </Button>
      </div>
    </Card>
  );
}

function CardsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl tracking-tight">My Cards</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Order New Card
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cardData.map((card) => (
          <CardDisplay card={card} key={card.id} />
        ))}
        <Card className="flex items-center justify-center border-dashed">
          <Button className="flex h-full w-full flex-col py-8" variant="ghost">
            <PlusCircle className="mb-2 h-6 w-6" />
            Add Virtual Card
          </Button>
        </Card>
      </div>
    </div>
  );
}
