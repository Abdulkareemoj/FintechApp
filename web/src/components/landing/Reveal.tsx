import { type ReactNode, useEffect, useRef } from "react";

interface RevealProps {
	children: ReactNode;
	className?: string;
	stagger?: boolean;
}

export function Reveal({ children, className, stagger = true }: RevealProps) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					if (stagger) {
						el.classList.add("is-shown");
					} else {
						el.setAttribute("data-open", "true");
					}
					observer.disconnect();
				}
			},
			{ threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [stagger]);

	return (
		<div
			ref={ref}
			className={`${stagger ? "t-stagger" : "t-panel-slide"} ${className ?? ""}`}
			data-open={stagger ? undefined : "false"}
		>
			{children}
		</div>
	);
}
