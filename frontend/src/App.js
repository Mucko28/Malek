import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideDock from "./components/site/SideDock";
import HeroVideo from "./components/site/HeroVideo";
import About from "./components/site/About";
import Menu from "./components/site/Menu";
import Visit from "./components/site/Visit";
import Reviews from "./components/site/Reviews";
import Footer from "./components/site/Footer";
import { Toaster } from "./components/ui/toaster";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#A8A099] text-[#2a2724] font-sans">
      <SideDock />
      <HeroVideo />
      <About />
      <Menu />
      <Visit />
      <Reviews />
      <Footer />
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
      <Toaster />
    </div>
  );
}

export default App;
