import './App.css';
import Navbar from './components/Navbar';
import {Outlet} from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
            <Navbar />
            <Outlet />
        </div>
      </header>
    </div>
  );
}

export default App;
