import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import useLenis from "@/hooks/useLenis";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Manifesto } from "@/components/Manifesto";
import { Rooms } from "@/components/Rooms";
import { Availability } from "@/components/Availability";
import { BookingTabs } from "@/components/BookingTabs";
import { Contact } from "@/components/Contact";
import Admin from "@/pages/Admin";

const Home = () => {
  useLenis();
  return (
    <div className="grain bg-limewash text-earth font-sans antialiased overflow-x-clip">
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
};

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" toastOptions={{ style: { background: "#FCF9F2", border: "1px solid #E6D7C3", color: "#231F1D" } }} />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
