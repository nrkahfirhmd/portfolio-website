import Image from "next/image";

interface Props {
    icon: string;
    label: string;
    className: string;
}

export default function FloatingItem({
    icon,
    label,
    className,
}: Props) {
    return (
        <button
            className={`absolute group transition-all duration-300 hover:scale-110 ${className}`}
        >
            <Image
                src={icon}
                alt={label}
                width={120}
                height={120}
                className="drop-shadow-xl"
            />

            <p className="mt-3 text-center font-semibold text-lg">
                {label}
            </p>
        </button>
    );
}