import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatListItem } from "./ChatListItem";
import type { Chat } from "./types";

interface Props {
	chats: Chat[];
	activeId?: string;
	onSelect: (chat: Chat) => void;
	onNew?: () => void;
	title?: string;
	searchPlaceholder?: string;
}

export function ChatList({
	chats,
	activeId,
	onSelect,
	onNew,
	title = "Chats",
	searchPlaceholder = "Search chats...",
}: Props) {
	const [query, setQuery] = useState("");
	const filtered = useMemo(
		() =>
			chats.filter(
				(c) =>
					c.name.toLowerCase().includes(query.toLowerCase()) ||
					c.lastMessage.toLowerCase().includes(query.toLowerCase()),
			),
		[chats, query],
	);

	return (
		<div className="flex h-full flex-col bg-card">
			<div className="space-y-3 border-b border-border/70 p-4">
				<div className="flex items-center justify-between">
					<h1 className="font-bold text-2xl text-foreground">{title}</h1>
					{onNew ? (
						<Button className="h-9 w-9 rounded-full" onClick={onNew} size="icon" variant="ghost">
							<Plus className="h-5 w-5" />
						</Button>
					) : null}
				</div>
				<div className="relative">
					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						className="pl-9"
						onChange={(e) => setQuery(e.target.value)}
						placeholder={searchPlaceholder}
						value={query}
					/>
				</div>
			</div>

			<ScrollArea className="flex-1">
				<div className="pb-4">
					{filtered.map((chat) => (
						<ChatListItem
							active={chat.id === activeId}
							chat={chat}
							key={chat.id}
							onClick={() => onSelect(chat)}
						/>
					))}
					{filtered.length === 0 && (
						<p className="px-4 py-8 text-center text-sm text-muted-foreground">
							No conversations found.
						</p>
					)}
				</div>
			</ScrollArea>
		</div>
	);
}
