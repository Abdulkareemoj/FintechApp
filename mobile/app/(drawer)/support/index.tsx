import React from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { ChatList } from "@/components/messages/ChatList";
import { ConversationView } from "@/components/messages/ConversationView";
import type { Chat, Message } from "@/components/messages/types";
import { useCreateTicket, useMyTickets, useSendTicketMessage, useTicketMessages } from "@/hooks/useSupport";
import type { SupportMessage, SupportTicket } from "@/lib/api/support";

const categories = [
  { value: "Transaction", label: "Transaction Issue" },
  { value: "Account", label: "Account Problem" },
  { value: "Card", label: "Card Issue" },
  { value: "Security", label: "Security Concern" },
  { value: "Other", label: "Other" },
];

const statusMap: Record<string, Chat["status"]> = {
  Open: "open",
  InProgress: "progress",
  Resolved: "resolved",
  Closed: "closed",
};

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function toChat(ticket: SupportTicket): Chat {
  return {
    id: ticket.id,
    name: ticket.subject,
    initials: initialsOf(ticket.subject),
    category: ticket.category,
    status: statusMap[ticket.status] ?? "open",
    lastMessage: ticket.lastMessage ?? ticket.description,
    timestamp: new Date(ticket.updatedAt).toLocaleDateString(),
  };
}

function toMessage(m: SupportMessage): Message {
  return {
    id: m.id,
    direction: m.isFromUser ? "outgoing" : "incoming",
    text: m.body,
    time: new Date(m.createdAt).toLocaleString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }),
    read: true,
  };
}

export default function SupportScreen() {
  const { data: tickets, isLoading, isError, refetch } = useMyTickets();
  const createTicket = useCreateTicket();

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [category, setCategory] = React.useState<{ value: string; label: string } | undefined>(undefined);
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");

  const activeTicket = ((tickets ?? []) as SupportTicket[]).find(
    (t) => t.id === activeId
  ) ?? null;
  const { data: messages, isLoading: messagesLoading } = useTicketMessages(activeTicket?.id ?? null);
  const sendMessage = useSendTicketMessage(activeTicket?.id ?? null);

  const chats = ((tickets ?? []) as SupportTicket[]).map(toChat);
  const canSubmit =
    subject.trim().length >= 3 &&
    message.trim().length >= 10 &&
    !!category?.value;

  const handleSubmit = async () => {
    try {
      const ticket = await createTicket.mutateAsync({
        category: category?.value ?? "Other",
        subject,
        description: message,
      });
      Alert.alert("Submitted", "Your ticket has been submitted. We'll get back to you soon.");
      setCategory(undefined);
      setSubject("");
      setMessage("");
      setDialogOpen(false);
      setActiveId(ticket.id);
    } catch (err) {
      Alert.alert("Failed", err instanceof Error ? err.message : "Please try again");
    }
  };

  const handleSend = async (text: string) => {
    if (!activeTicket) return;
    try {
      await sendMessage.mutateAsync(text);
    } catch (err) {
      Alert.alert("Failed", err instanceof Error ? err.message : "Please try again");
    }
  };

  return (
    <View className="flex-1">
      <Dialog
        onOpenChange={setDialogOpen}
        open={dialogOpen}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Support Ticket</DialogTitle>
          </DialogHeader>
          <View className="gap-4">
            <Field>
              <FieldContent>
                <Select onValueChange={setCategory} value={category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.value} value={c.value} label={c.label}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
            <View className="gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                onChangeText={setSubject}
                placeholder="Brief description of your issue"
                value={subject}
              />
            </View>
            <View className="gap-2">
              <Label htmlFor="message">Message</Label>
              <Input
                id="message"
                multiline
                onChangeText={setMessage}
                placeholder="Please provide as much detail as possible..."
                value={message}
              />
            </View>
            <Button
              disabled={!canSubmit || createTicket.isPending}
              onPress={handleSubmit}
            >
              <Text>{createTicket.isPending ? "Submitting..." : "Submit ticket"}</Text>
            </Button>
          </View>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <View className="items-center py-16">
          <ActivityIndicator size="large" className="text-primary" />
          <Text className="mt-3 text-sm text-muted-foreground">Loading tickets...</Text>
        </View>
      ) : isError ? (
        <View className="items-center gap-3 py-16">
          <Text className="text-sm text-muted-foreground">Couldn't load tickets.</Text>
          <Button variant="outline" onPress={() => refetch()}>
            <Text>Retry</Text>
          </Button>
        </View>
      ) : (tickets ?? []).length === 0 ? (
        <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
          <View className="gap-1">
            <Text className="font-bold text-3xl text-foreground">Support</Text>
            <Text className="text-muted-foreground">We're here to help.</Text>
          </View>
          <Card>
            <CardHeader>
              <CardTitle>No tickets yet</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="text-sm text-muted-foreground">
                Create a ticket to start a conversation with our support team.
              </Text>
              <Button className="mt-4" onPress={() => setDialogOpen(true)}>
                <Text>Create ticket</Text>
              </Button>
            </CardContent>
          </Card>
        </ScrollView>
      ) : activeTicket ? (
        <ConversationView
          chat={toChat(activeTicket)}
          loading={messagesLoading}
          messages={(messages ?? []).map(toMessage)}
          onBack={() => setActiveId(null)}
          onSend={handleSend}
          sending={sendMessage.isPending}
          showBack
        />
      ) : (
        <ChatList
          activeId={activeId ?? undefined}
          chats={chats}
          onNew={() => setDialogOpen(true)}
          onSelect={(c) => setActiveId(c.id)}
        />
      )}
    </View>
  );
}