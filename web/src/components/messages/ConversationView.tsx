import { ScrollArea } from "@/components/ui/scroll-area";
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
}

export function ConversationView({
	chat,
	messages,
	showBack,
	onBack,
	onSend,
	sending,
}: Props) {
	return (
		<div className="flex h-full flex-col bg-background">
			<ConversationHeader chat={chat} onBack={onBack} showBack={showBack} />

			<ScrollArea className="flex-1">
				<div className="flex flex-col gap-4 px-4 py-6 sm:px-6">
					{messages.map((m) => (
						<MessageBubble key={m.id} message={m} />
					))}
				</div>
			</ScrollArea>

			<MessageComposer
				disabled={sending}
				onSend={onSend}
				placeholder="Type a reply..."
			/>
		</div>
	);
}
