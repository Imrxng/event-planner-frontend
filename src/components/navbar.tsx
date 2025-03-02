
import { AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import logo from "../assets/images/brightest_logo_black_yellow.png";
import "../styles/navbar.component.css";

export default function Navbar() {

  return (
    <>
      <nav>
        <Link to="/" className="bright-logo">
          <img src={logo} alt="bright-logo" />
        </Link>
        <Link to="/" className="nav-links">
              <p className="nav-login">log in</p>
              <AiOutlineRight className="nav-icon"/>
        </Link>
      </nav>
    </>
  )
}

