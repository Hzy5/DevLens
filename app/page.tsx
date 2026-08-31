import { DebugWorkspace } from "@/components/DebugWorkspace";
import { ExampleResult } from "@/components/ExampleResult";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { InputTypes } from "@/components/InputTypes";
import { Navbar } from "@/components/Navbar";
import { SupportedTech } from "@/components/SupportedTech";

export default function Home() {
  return (
    <div id="top" className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1 pb-16">
        <Hero />
        <DebugWorkspace />
        <HowItWorks />
        <InputTypes />
        <ExampleResult />
        <SupportedTech />
      </main>
      <Footer />
    </div>
  );
}
