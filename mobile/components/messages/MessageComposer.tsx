import { useState } from "react";
import { Pressable, View } from "react-native";
import { Send, Smile } from "lucide-react-native";
import EmojiPickerModal, { emojiData } from "@hiraku-ai/react-native-emoji-picker";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface Props {
  onSend?: (text: string) => void;
  variant?: "desktop" | "mobile";
  disabled?: boolean;
  placeholder?: string;
}

export function MessageComposer({
  onSend,
  variant = "mobile",
  disabled,
  placeholder = "Type a reply...",
}: Props) {
  const [value, setValue] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);

  const handleSend = () => {
    if (!value.trim()) return;
    onSend?.(value);
    setValue("");
  };

  return (
    <>
      <View className="border-t border-border bg-background">
        <View
          className={cn(
            "flex-row items-center gap-2 px-4 py-3",
            variant === "desktop" && "rounded-lg"
          )}
        >
          <View className="relative flex-1">
            <Input
              className="pr-12"
              editable={!disabled}
              onChangeText={setValue}
              onSubmitEditing={handleSend}
              placeholder={placeholder}
              returnKeyType="send"
              value={value}
            />
            <View className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button
                className="h-8 w-8"
                disabled={disabled}
                onPress={() => setEmojiOpen(true)}
                size="icon"
                variant="ghost"
              >
                <Icon as={Smile} className="text-muted-foreground size-4" />
              </Button>
            </View>
          </View>

          <Button
            className="h-11 w-11 shrink-0"
            disabled={disabled || !value.trim()}
            onPress={handleSend}
            size="icon"
            variant={variant === "mobile" ? "outline" : "default"}
          >
            <Icon as={Send} className="text-foreground size-4" />
          </Button>
        </View>
      </View>

      <EmojiPickerModal
        darkMode
        emojis={emojiData}
        onClose={() => setEmojiOpen(false)}
        onEmojiSelect={(emoji) => setValue((v) => v + emoji)}
        visible={emojiOpen}
      />
    </>
  );
}