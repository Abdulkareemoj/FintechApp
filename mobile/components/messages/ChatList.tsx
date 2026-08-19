import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { ChatListItem } from "./ChatListItem";
import type { Chat } from "./types";
import { Search, Plus } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

interface Props {
  chats: Chat[];
  activeId?: string;
  onSelect: (chat: Chat) => void;
  onNew: () => void;
}

export function ChatList({ chats, activeId, onSelect, onNew }: Props) {
  const [query, setQuery] = useState("");

  const filtered = chats.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View className="flex h-full flex-col bg-background">
      <View className="gap-4 p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-foreground">Tickets</Text>
          <Button className="h-9 w-9 rounded-full" onPress={onNew} size="icon" variant="outline">
            <Icon as={Plus} className="text-foreground size-4" />
          </Button>
        </View>
        <View className="relative">
          <View className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <Icon as={Search} className="text-muted-foreground size-4" />
          </View>
          <Input
            className="pl-9"
            onChangeText={setQuery}
            placeholder="Search tickets..."
            value={query}
          />
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="pb-4">
          {filtered.map((chat) => (
            <ChatListItem
              active={chat.id === activeId}
              chat={chat}
              key={chat.id}
              onPress={() => onSelect(chat)}
            />
          ))}
          {filtered.length === 0 && (
            <Text className="px-4 py-8 text-center text-sm text-muted-foreground">
              No tickets found.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}