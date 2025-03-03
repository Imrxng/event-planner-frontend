import { AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import logo from "../assets/images/brightest_logo_black_yellow.png";
import "../styles/navbar.component.css";
import { useState } from "react";

export default function Navbar() {
  const [logged, setLogged] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      <nav>
        <Link to="/" className="bright-logo">
          <img src={logo} alt="bright-logo" />
        </Link>
        <div className="nav-links">
          <p className="nav-login" onClick={toggleDropdown}>
            {logged ? "Profile" : "Log in"}
          </p>
          <AiOutlineRight className="nav-icon" />
          {dropdownOpen && (
            <div className="dropdown-menu">
              {logged ? (
                <>
                  <Link to="/profile">Profile</Link>
                  <Link to="/settings">Settings</Link>
                  <Link to="/logout">Log out</Link>
                </>
              ) : (
                <>
                  <Link to="/login">Log in</Link>
                  <Link to="/register">Register</Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}