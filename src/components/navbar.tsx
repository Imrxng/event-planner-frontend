import { AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import logo from "../assets/images/brightest_logo_black_yellow.png";
import "../styles/navbar.component.css";
import { useAuth0 } from "@auth0/auth0-react";

export default function Navbar() {
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();

  return (
    <>
    { isAuthenticated ?
      <nav>
        <Link to="/" className="bright-logo">
          <img src={logo} alt="bright-logo" />
        </Link>
        <div className="nav-links">
              <p className="nav-login">{user?.name}</p>
              <AiOutlineRight className="nav-icon"/>
        </div>
      </nav>:
      <nav>
        <Link to="/login" className="bright-logo">
          <img src={logo} alt="bright-logo" />
        </Link>
        <div  className="nav-links" onClick={() => loginWithRedirect()}>
              <p className="nav-login">Login</p>
              <AiOutlineRight className="nav-icon"/>
        </div>
      </nav>
    </>
  );
}