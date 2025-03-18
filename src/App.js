import './App.css';
import Navbar from './components/Navbar';
import {useOutlet} from 'react-router-dom';


function DefaultPage()
{
    const outlet = useOutlet();
    if(outlet)
    {
        return outlet;
    }
    return (<>
        <div>CS230 Music CRUD front end</div>
        <div>&Eacute;amonn Peter Kearns</div>
        <div>60460770</div>
    </>);
}

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <div>
            <Navbar />
            <DefaultPage />
        </div>
      </header>
    </div>
  );
}

export default App;
