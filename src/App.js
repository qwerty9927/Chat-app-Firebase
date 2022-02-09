import logo from './logo.svg';
import { handleLogOut } from './component/inOut'
import './App.css';
import SideBar from './component/sidebar';
import Main from './component/main';

function App() {
  return (
    <div className="App">
      <SideBar />
      <Main />
    </div>
  );
}

export default App;
