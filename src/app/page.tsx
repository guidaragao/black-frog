import Header from "@/components/Header";
import CursorBug from "@/components/CursorBug";
import Intro from "@/components/Intro";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Units from "@/components/Units";
import Leap from "@/components/Leap";
import CaseFeature from "@/components/CaseFeature";
import PointOfView from "@/components/PointOfView";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-bf-green focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-bf-black"
      >
        Skip to content
      </a>
      <CursorBug />
      <Intro />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Units />
        <Leap />
        <CaseFeature />
        <PointOfView />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
