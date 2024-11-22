import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import './App.css';
import FAQ from './components/FAQ';
import Cards from './components/Cards';
import Footer from './components/Footer';

function App() {
  return (
    <>
    <Router>
      <div className="App">
        <Header />
        
        <Routes>
          <Route
            path="/"
            element={<div id="hero"><HeroSection /></div>}
          />
          <Route
            path="features"
            element={<div id="features"><HeroSection /></div>}
          />
        </Routes>
      </div>
    </Router>
    <div>
      <FAQ/>
    </div>
    <div>
      <Cards/>
    </div>
    <div>
      <Footer/>
    </div>
    </>
  );
}

export default App;
