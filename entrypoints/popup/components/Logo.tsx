import * as React from "react";

interface SvgIconProps {
	size?: number;
	fill?: string;
}

const Logo: React.FC<SvgIconProps> = ({ size = 32, fill = "#008080" }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		fill={fill}
		viewBox="0 0 256 256"
	>
		<path d="M224 56v56c0 52.72-25.52 84.67-46.93 102.19-23.06 18.86-46 25.27-47 25.53a8 8 0 0 1-4.2 0c-1-.26-23.91-6.67-47-25.53C57.52 196.67 32 164.72 32 112V56a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16"></path>
	</svg>
);

export default Logo;