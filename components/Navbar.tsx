export default function Navbar() {
    return (
        <header className="absolute inset-x-0 top-0 z-50">
            {/* pt clears the notch on devices that have one and collapses back
                to the plain py-4 on every device that doesn't. */}
            <nav className="flex items-center justify-between px-gutter py-4 pt-[max(1rem,env(safe-area-inset-top))]">
                <div className="flex font-bold text-primary">
                    <span>K</span>
                    <span>Ɣ</span>
                </div>

                <div className="font-bold text-text-muted font-heading text-mark tracking-wide">???</div>
            </nav>
        </header>
    );
}
