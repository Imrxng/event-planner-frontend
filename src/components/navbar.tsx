
import { AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import logo from "../assets/images/brightest_logo_black_yellow.png";
import "../styles/navbar.component.css";
import { useState } from "react";

export default function Navbar() {
  const [logged,setLogged] = useState(false);

  return (
    <>
    {logged ?
      <nav>
        <Link to="/" className="bright-logo">
          <img src={logo} alt="bright-logo" />
        </Link>
        <Link to="/" className="nav-links">
              <p className="nav-login">log in</p>
              <AiOutlineRight className="nav-icon"/>
        </Link>
      </nav>:
      <nav>
        <Link to="/" className="bright-logo">
          <img src={logo} alt="bright-logo" />
        </Link>
        <Link to="/login" className="nav-links">
              <p className="nav-login">Imran Ghaddoura</p>
              <AiOutlineRight className="nav-icon"/>
        </Link>
        </nav>
      }
    </>
  )
}