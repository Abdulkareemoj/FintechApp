import { View } from "react-native";
import { CheckCheck } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { Message } from "./types";

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isOutgoing = message.direction === "outgoing";

  return (
    <View className={cn("flex w-full flex-row gap-2", isOutgoing ? "justify-end" : "justify-start")}>
      <View
        className={cn(
          "flex max-w-[78%] flex-col",
          isOutgoing ? "items-end" : "items-start"
        )}
      >
        <View
          className={cn(
            "rounded-2xl border px-4 py-3",
            isOutgoing
              ? "border-primary/60 bg-primary"
              : "border-border/60 bg-muted"
          )}
        >
          <Text
            className={cn(
              "text-sm leading-relaxed",
              isOutgoing ? "text-primary-foreground" : "text-foreground"
            )}
          >
            {message.text}
          </Text>
        </View>
        <View className="mt-1.5 flex-row items-center gap-1.5 px-1">
          <Text className="text-[11px] text-muted-foreground">{message.time}</Text>
          {isOutgoing && message.read && (
            <Icon as={CheckCheck} className="size-3.5 text-primary" />
          )}
        </View>
      </View>
    </View>
  );
}