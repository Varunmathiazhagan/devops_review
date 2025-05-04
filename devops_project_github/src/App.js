import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

import Home from './components/home';
import ProblemStatementCards from './components/ProblemStatementCards';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';
import './components/animations.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <div className="app-container">
              <Home />
              <ProblemStatementCards />
              <Contact />
              <Footer />
            </div>
          } />
        </Routes>
        <Analytics />
      </div>
    </Router>
  );
}

export default App;
