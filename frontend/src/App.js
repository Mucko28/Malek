import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/site/Navbar";
import HeroVideo from "./components/site/HeroVideo";
import Flavours from "./components/site/Flavours";
import Testimonials from "./components/site/Testimonials";
import Contact from "./components/site/Contact";
import Footer from "./components/site/Footer";
import { Toaster } from "./components/ui/toaster";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#FBE4EA] text-[#5b1f33] font-sans">
      <Navbar />
      <HeroVideo />
      <Flavours />
      <Testimonials />
      <Contact />
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
