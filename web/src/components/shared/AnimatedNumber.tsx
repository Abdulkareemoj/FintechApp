import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
	value: string;
	className?: string;
}

export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
	const groupRef = useRef<HTMLSpanElement>(null);
	const [digits, setDigits] = useState<string[]>([]);

	useEffect(() => {
		const chars = value.split("");
		const group = groupRef.current;
		if (group) group.classList.remove("is-animating");
		setDigits(chars);
		requestAnimationFrame(() => {
			group?.classList.add("is-animating");
		});
	}, [value]);

	return (
		<span
			ref={groupRef}
			className={`t-digit-group is-animating ${className ?? ""}`}
		>
			{digits.map((ch, i) => {
				const stagger =
					i === digits.length - 2
						? "1"
						: i === digits.length - 1
							? "2"
							: undefined;
				return (
					// biome-ignore lint/suspicious/noArrayIndexKey: digit position is the meaningful key
					<span key={i} className="t-digit" data-stagger={stagger}>
						{ch}
					</span>
				);
			})}
		</span>
	);
}
