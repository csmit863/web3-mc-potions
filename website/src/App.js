import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import BrewingStand from './pages/BrewingStand';
function App() {
  return (
    <Router>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <div className='App' >
          <Routes> 
            <Route path="/" element={<BrewingStand/>} exact />
            <Route path="/dashboard" element={<BrewingStand/>} exact />
            
          </Routes>
      </div>
    </Router>
   
  );
}

export default App;