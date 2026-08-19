import { ActivityIndicator, ScrollView, View } from "react-native";
import { ConversationHeader } from "./ConversationHeader";
import { MessageBubble } from "./MessageBubble";
import { MessageComposer } from "./MessageComposer";
import type { Chat, Message } from "./types";

interface Props {
  chat: Chat;
  messages: Message[];
  showBack?: boolean;
  onBack?: () => void;
  onSend?: (text: string) => void;
  sending?: boolean;
  loading?: boolean;
}

export function ConversationView({
  chat,
  messages,
  showBack,
  onBack,
  onSend,
  sending,
  loading,
}: Props) {
  return (
    <View className="flex h-full flex-col bg-background">
      <ConversationHeader chat={chat} onBack={onBack} showBack={showBack} />

      <ScrollView className="flex-1">
        <View className="flex flex-col gap-4 px-4 py-6">
          {loading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" className="text-primary" />
            </View>
          ) : (
            messages.map((m) => <MessageBubble key={m.id} message={m} />)
          )}
        </View>
      </ScrollView>

      <MessageComposer disabled={sending} onSend={onSend} />
    </View>
  );
}