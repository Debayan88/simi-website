import "@/App.css";
import { Toaster } from "sonner";
import useLenis from "@/hooks/useLenis";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Manifesto } from "@/components/Manifesto";
import { Rooms } from "@/components/Rooms";
import { Availability } from "@/components/Availability";
import { BookingTabs } from "@/components/BookingTabs";
import { Contact } from "@/components/Contact";

function App() {
  useLenis();
  return (
    <div className="App grain bg-limewash text-earth font-sans antialiased overflow-x-clip">
      <Toaster position="top-center" toastOptions={{ style: { background: "#FCF9F2", border: "1px solid #E6D7C3", color: "#231F1D" } }} />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Rooms />
        <Availability />
        <BookingTabs />
        <Contact />
      </main>
    </div>
  );
}

export default App;
