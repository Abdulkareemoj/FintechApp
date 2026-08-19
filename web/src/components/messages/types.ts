export interface Chat {
	id: string;
	name: string;
	initials: string;
	avatar?: string;
	category?: string;
	status: "open" | "progress" | "resolved" | "closed";
	lastMessage: string;
	timestamp: string;
	unread?: number;
}

export interface Message {
	id: string;
	direction: "incoming" | "outgoing";
	text: string;
	time: string;
	read?: boolean;
}
