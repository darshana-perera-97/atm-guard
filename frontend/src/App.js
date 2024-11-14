import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import 'leaflet/dist/leaflet.css';
import "./App.css";
import Design from "./Design/Design";
import Pages from "./Design/Pages";
import Design2 from "./Design/Design2";

function App() {
  return (
    <div>
      {/* <Design /> */}
      <Pages />
      {/* <Design2 /> */}
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
