import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useAuthz } from '../AuthzContext'; // Import Authz
import './Home.css';

const Home = () => {
  const { isAuthenticated, loginWithRedirect, logout, isLoading } = useAuth0();
  const { savedRole, loadingAuthz } = useAuthz(); // Use Context
  const navigate = useNavigate();

  // Check if the user already selected a role
  useEffect(() => {
    if (isLoading || loadingAuthz) return; // Wait for loading

    if (isAuthenticated) {
      if (savedRole && savedRole !== "None") {
        navigate(savedRole === "Patient" ? "/patient-dashboard" : "/users");
      } else {
        navigate("/roles");
      }
    }
  }, [isAuthenticated, isLoading, loadingAuthz, savedRole, navigate]);

  // Handle login with redirect to roles page
  const handleLogin = async () => {
    await loginWithRedirect()
  };


  return (
    <div>
      {/* Navbar */}
      <nav>
        <div className="logo">
          <img className="logoNav" src="/assets/logo.svg" alt="logo" />
        </div>
        <ul className="nav-links" id="nav-links">
          <li>
            <a href="#">Dashboard</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            {isAuthenticated ? (
              <button
                className="navButton"
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              >
                Log Out
              </button>
            ) : (
              <button className="navButton" onClick={handleLogin}>
                Log In
              </button>
            )}
          </li>
        </ul>
      </nav>

      {/* Intro Section */}
      <div className="intro" id="intro">
        <div className="containerHeader">
          <div className="headerCol1">
            <div className="headerItems">
              <div className="topBorder"></div>
              <h1>Humanizing</h1>
              <h1>your insurance.</h1>
              <p>
                Get your safe insurance coverage easier and faster. We simplify and automate the OPD insurance claims process to eliminate inefficiencies and frustration for insurers, providers, and patients.
              </p>
              {isAuthenticated ? (
                <button
                  className="headerButton"
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                >
                  Log Out
                </button>
              ) : (
                <button className="headerButton" onClick={handleLogin}>
                  Log In
                </button>
              )}
            </div>
          </div>
          <div className="headerCol2">
            <div id="intro-img"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
