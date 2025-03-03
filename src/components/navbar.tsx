import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import logo from "../assets/images/brightest_logo_black_yellow.png";
import "../styles/navbar.component.css";

export default function Navbar() {
  const { isAuthenticated, user, loginWithRedirect, logout, isLoading } = useAuth0();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  console.log(user);
  console.log(isAuthenticated);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <nav>
        <Link to="/" className="bright-logo">
          <img src={logo} alt="bright-logo" />
        </Link>
        {isAuthenticated ? (
          <div className="nav-links">
            <div className="nav-login" onClick={toggleDropdown}>
              <p>{user?.name}</p>
              <AiOutlineRight className="nav-icon" />
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile">Profile</Link>
                  <Link to="/settings">Settings</Link>
                  <button onClick={() => logout({  })}>
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="nav-links" onClick={() => loginWithRedirect()}>
            <p className="nav-login">Login</p>
            <AiOutlineRight className="nav-icon" />
          </div>
        )}
      </nav>
    </>
  );
}