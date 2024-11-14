import React from "react";
import SideNavBar from "./Layout/SideNavbar";
import Dashboard from "./Layout/Dashboard";
import LoginScreen from "./Layout/LoginScreen";
import Dashboard2 from "./Layout/Dashboard2";
import MainDashboard from "./Layout/MainDashboard";

export default function Pages() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleLogin = (username, password) => {
    // if (username === "a" && password === "a") {
    if (username === "ATM" && password === "ATM") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };
  return (
    <div>
      {/* <SideNavBar/> */}
      {/* <Dashboard /> */}
      {/* <MainDashboard /> */}
      {/* <Dashboard2 /> */}
      {/* <LoginScreen /> */}
      {isLoggedIn ? (
        <div>
          <MainDashboard isLoggedIn={isLoggedIn} />
        </div>
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
      {/* <div className="copyright">
        <p>Copyright by ABC Company</p>
      </div> */}
    </div>
  );
}
