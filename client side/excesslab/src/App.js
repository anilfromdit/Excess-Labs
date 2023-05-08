
import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Home from "./components/Home/Home.jsx"
import Header from "./components/Layouts/Header.jsx";
import Footer from "./components/Layouts/Footer.jsx";
import Login from "./components/Auth/Login.jsx";
import SignUp from "./components/Auth/SignUp.jsx";
import Apps from "./components/Apps/Apps.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import WIP from "./components/Extras/WIP.jsx";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/*" element={<WIP />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;