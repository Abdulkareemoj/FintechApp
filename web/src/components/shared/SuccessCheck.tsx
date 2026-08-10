import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface SuccessCheckProps {
	className?: string;
}

export function SuccessCheck({ className }: SuccessCheckProps) {
	const wrapperRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper) return;
		wrapper.setAttribute("data-state", "out");
		void wrapper.offsetWidth;
		wrapper.setAttribute("data-state", "in");
	}, []);

	return (
		<span
			ref={wrapperRef}
			className={cn("t-success-check", className)}
			data-state="out"
			aria-hidden="true"
		>
			<svg viewBox="0 0 48 48" fill="none">
				<title>Success</title>
				<path
					strokeWidth="4"
					strokeLinecap="round"
					strokeLinejoin="round"
					stroke="currentColor"
					d="M8 25 L20 37 L40 13"
				/>
			</svg>
		</span>
	);
}
