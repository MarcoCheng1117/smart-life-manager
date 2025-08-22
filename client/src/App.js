import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Simple components for now
const Dashboard = () => (
  <div>
    <h2>Dashboard</h2>
    <p>Welcome to your Smart Life Manager dashboard!</p>
  </div>
);

const Tasks = () => (
  <div>
    <h2>Tasks</h2>
    <p>Manage your tasks here.</p>
  </div>
);

const Goals = () => (
  <div>
    <h2>Goals</h2>
    <p>Track your goals here.</p>
  </div>
);

const Health = () => (
  <div>
    <h2>Health</h2>
    <p>Monitor your health metrics here.</p>
  </div>
);

const Finance = () => (
  <div>
    <h2>Finance</h2>
    <p>Track your finances here.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Smart Life Manager</h1>
          <nav>
            <a href="#/">Dashboard</a> | 
            <a href="#/tasks"> Tasks</a> | 
            <a href="#/goals"> Goals</a> | 
            <a href="#/health"> Health</a> | 
            <a href="#/finance"> Finance</a>
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/health" element={<Health />} />
            <Route path="/finance" element={<Finance />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 