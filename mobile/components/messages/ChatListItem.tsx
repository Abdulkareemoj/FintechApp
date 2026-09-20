import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { Chat } from "./types";

interface Props {
  chat: Chat;
  active?: boolean;
  onPress?: () => void;
}

export function ChatListItem({ chat, active, onPress }: Props) {
  return (
    <Pressable
      className={cn(
        "min-h-[76px] w-full flex-row items-center gap-3 border-b border-border/60 px-4 py-3.5 active:bg-muted/60",
        active && "border-l-4 border-l-primary bg-primary/10"
      )}
      onPress={onPress}
    >
      <View className="flex min-w-0 flex-1">
        <View className="flex-row items-center justify-between gap-2">
          <Text className="text-sm font-semibold text-foreground flex-1" numberOfLines={1}>
            {chat.name}
          </Text>
          <Text className="text-xs text-muted-foreground shrink-0">{chat.timestamp}</Text>
        </View>
        <View className="mt-1 flex-row items-center gap-2">
          <Text className="text-xs text-muted-foreground flex-1" numberOfLines={1}>
            {chat.lastMessage}
          </Text>
          {chat.unread ? <View className="h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1"><Text className="text-[10px] font-semibold text-primary-foreground">{chat.unread}</Text></View> : null}
        </View>
      </View>
    </Pressable>
  );
}
