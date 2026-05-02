import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideDock from "./components/site/SideDock";
import HeroVideo from "./components/site/HeroVideo";
import Marquee from "./components/site/Marquee";
import About from "./components/site/About";
import Visit from "./components/site/Visit";
import Menu from "./components/site/Menu";
import Reviews from "./components/site/Reviews";
import Footer from "./components/site/Footer";
import Drip from "./components/site/Drip";
import { Toaster } from "./components/ui/toaster";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#A8A099] text-[#2a2724] font-sans">
      <SideDock />
      <HeroVideo />
      <Marquee
        items={[
          "TOČENÁ ZMRZLINA",
          "OVOCNÉ TŘÍŠTĚ",
          "OD ROKU 1997",
          "SLATIŇANY",
          "POCTIVÉ PORCE",
          "DOMÁCÍ KVALITA",
        ]}
        bg="#C46B5B"
        fg="#F4EFE8"
        accent="#2a2724"
      />
      <About />
      <Visit />
      <div className="bg-[#F4EFE8]">
        <Drip color="#2a2724" height={70} />
      </div>
      <Menu />
      <Marquee
        items={["NATOČ SI", "OCHUTNEJ", "VRAC SE", "TOČENÁ RADOST"]}
        bg="#1a1816"
        fg="#F4EFE8"
        accent="#C46B5B"
        speed={50}
      />
      <Reviews />
      <Footer />
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
