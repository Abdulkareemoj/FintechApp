import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Chat } from "./types";
import { Button } from "../ui/button";

interface Props {
	chat: Chat;
	active?: boolean;
	onClick?: () => void;
}

export function ChatListItem({ chat, active, onClick }: Props) {
	return (
		<Button
			className={cn(
				"relative h-auto min-h-[76px] w-full justify-start rounded-none border-border/60 border-b px-4 py-3 text-left transition-colors hover:bg-muted/60",
				active && "bg-primary/10 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-primary",
			)}
			onClick={onClick}
			type="button"
			variant="ghost"
		>
			<div className="relative shrink-0">
				<Avatar className="h-10 w-10">
					{chat.avatar && <AvatarImage alt={chat.name} src={chat.avatar} />}
					<AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
						{chat.initials}
					</AvatarFallback>
				</Avatar>
			</div>

			<div className="min-w-0 flex-1">
				<div className="flex items-center justify-between gap-2">
					<p className="truncate text-sm font-semibold text-foreground">
						{chat.name}
					</p>
					<span className="shrink-0 text-xs text-muted-foreground">
						{chat.timestamp}
					</span>
				</div>
				<div className="mt-1 flex items-center gap-2">
					<p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
						{chat.lastMessage}
					</p>
					{chat.unread ? (
						<span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
							{chat.unread}
						</span>
					) : null}
				</div>
			</div>
		</Button>
	);
}
