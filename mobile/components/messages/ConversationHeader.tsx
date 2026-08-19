import { Pressable, View } from "react-native";
import { ArrowLeft, MoreHorizontal } from "lucide-react-native";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import type { Chat } from "./types";

interface Props {
  chat: Chat;
  showBack?: boolean;
  onBack?: () => void;
}

const statusLabel: Record<Chat["status"], string> = {
  open: "Open",
  progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export function ConversationHeader({ chat, showBack, onBack }: Props) {
  return (
    <View className="flex-row items-center justify-between gap-3 border-b border-border bg-background px-4 py-3">
      <View className="flex min-w-0 flex-row items-center gap-3">
        {showBack && (
          <Button className="h-9 w-9 shrink-0" onPress={onBack} size="icon" variant="outline">
            <Icon as={ArrowLeft} className="text-foreground size-4" />
          </Button>
        )}
        <View className="min-w-0 flex-1">
          <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
            {chat.name}
          </Text>
          <View className="mt-0.5 flex-row items-center gap-1.5">
            <Badge variant={chat.status === "closed" ? "secondary" : "outline"}>
              <Text className="text-[10px]">{statusLabel[chat.status]}</Text>
            </Badge>
            {chat.category ? (
              <Text className="text-[10px] text-muted-foreground" numberOfLines={1}>
                {chat.category}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      <Button size="icon" variant="outline">
        <Icon as={MoreHorizontal} className="text-foreground size-4" />
      </Button>
    </View>
  );
}