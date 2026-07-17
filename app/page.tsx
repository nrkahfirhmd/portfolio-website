import Image from "next/image";
import FloatingItem from "./components/FloatingItem";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <h1 className="font-bold text-2xl">Nurkahfi.</h1>
          <nav className="flex gap-10 text-sm font-medium">
            <a href="#">Home</a>
            <a href="#">Projects</a>
            <a href="#">Skills</a>
            <a href="#">Contact</a>
          </nav>
        </div>
      </header>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* LEFT */}
        <FloatingItem
          icon="/file.svg"
          label="Projects"
          className="
        left-[8%]
        top-1/2
        -translate-y-1/2
        "
        />

        {/* RIGHT */}
        <FloatingItem
          icon="/file.svg"
          label="Contact"
          className="
        right-[8%]
        top-1/2
        -translate-y-1/2
        "
        />
        {/* TOP */}

        <FloatingItem
          icon="/file.svg"
          label="Skills"
          className="
        top-[10%]
        left-1/2
        -translate-x-1/2
        "
        />

        {/* BOTTOM */}
        <FloatingItem
          icon="/file.svg"
          label="About"
          className="
        bottom-[8%]
        left-1/2
        -translate-x-1/2
        "
        />

        {/* CENTER CHARACTER */}
        <div className="relative z-10">
          <Image
            src="/file.svg"
            alt="avatar"
            width={420}
            height={650}
            priority
          />
        </div>
      </section>

      <footer className="fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-auto flex max-w-7xl justify-between px-8 py-6 text-sm text-gray-500">
          <span>© 2026 Nurkahfi Rahmada</span>
          <div className="flex gap-6">
            <a href="#">Github</a>
            <a href="#">LinkedIn</a>
            <a href="#">Resume</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
