import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Chat } from "./types";

interface Props {
	chat: Chat;
	active?: boolean;
	onClick?: () => void;
}

const statusLabel: Record<Chat["status"], string> = {
	open: "Open",
	progress: "In Progress",
	resolved: "Resolved",
	closed: "Closed",
};

export function ChatListItem({ chat, active, onClick }: Props) {
	return (
		<Button
			className={cn(
				"flex w-full items-start gap-3 px-4 py-3 text-left transition-colors border-b border-border/60 hover:bg-muted/60",
				active && "bg-muted",
			)}
			onClick={onClick}
			type="button"
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
				<div className="mt-1 flex items-center justify-between gap-2">
					<p className="truncate text-xs text-muted-foreground">
						{chat.lastMessage}
					</p>
					<Badge
						className="shrink-0 text-[10px]"
						variant={chat.status === "closed" ? "secondary" : "outline"}
					>
						{statusLabel[chat.status]}
					</Badge>
				</div>
			</div>
		</button>
	);
}
