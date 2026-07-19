import Image from "next/image";

interface Item {
    label: string;
}

interface Props {
    items: Item[];
    selected: string;
    onSelect: (label: string) => void;
}

export default function SidebarMenu({ items, selected, onSelect }: Props) {
    return (
        <div className="flex flex-row h-screen">
            <div className="relative pt-16 flex flex-col gap-12">
                <div className="flex flex-col gap-8">
                    <h1 className="text-center">KAHFI</h1>

                    <div className="px-4">
                        <Image
                            src={'/photo.jpg'}
                            alt={"Personal Picture"}
                            width={250}
                            height={120}
                        />
                    </div>
                </div>

                <nav className="z-10 overflow-hidden border border-border">
                    {items.map((item) => {
                        const isSelected = item.label === selected;

                        return (
                            <button
                                key={item.label}
                                onClick={() => onSelect(item.label)}
                                className="
                                    group
                                    relative
                                    flex
                                    w-full
                                    items-center
                                    overflow-hidden
                                    border-b
                                    border-border
                                    last:border-b-0
                                    py-4
                                    text-left
                                "
                            >
                                {/* Expanding background */}
                                <div
                                    className={`
                                        absolute
                                        inset-0
                                        origin-left
                                        bg-primary
                                        transition-transform
                                        duration-300
                                        ease-out
                                        ${isSelected ? "scale-x-100" : "scale-x-4"}
                                    `}
                                />

                                {/* Content */}
                                <div className="relative z-10 flex items-center px-6">
                                    <p
                                        className={`
                                            font-heading
                                            text-3xl
                                            tracking-wide
                                            transition-colors
                                            duration-300
                                            ${isSelected
                                                ? "text-white"
                                                : "text-text-muted group-hover:text-text"
                                            }
                                    `}
                                    >
                                        {item.label}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </nav>
                
                <div className="absolute bottom-0 left-0 h-120 w-full bg-gradient-to-b from-white to-primary" />
            </div>

            <span className="w-[1px] bg-black" />
            
            <div className="flex flex-col gap-6 text-center py-16">
                <h1 className="font-bold text-xl">窟</h1>
                
                <h2 className="rotate-90 text-2xl font-heading">Projects</h2>

                {/* interactivity later */}
            </div>
            
        </div>
    );
}
