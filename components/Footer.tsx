export default function Footer() {
    return (
        <footer className="fixed inset-x-0 bottom-0 z-50">
            <div className="flex justify-between px-8 py-4">
                <span className="font-bold text-text font-heading text-xl tracking-wide">LAB</span>

                <div className="flex gap-2 text-sm text-text-muted">
                    <span>Bali</span>
                    <time>20:52</time>
                </div>
            </div>
        </footer>
    );
}
