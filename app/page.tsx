import Image from "next/image";
import FloatingItem from "@/components/FloatingItem";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { floatingItems } from "@/lib/home";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <Navbar />

      <section className="relative flex min-h-screen items-center justify-center">
        {floatingItems.map((item) => (
          <FloatingItem key={item.label} {...item} />
        ))}

        <div className="relative z-10">
          <Image
            src="/home/avatar.png"
            alt="Nurkahfi Rahmada"
            width={420}
            height={650}
            priority
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
