import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useState } from "react";
import { AiOutlineRight, AiOutlineDown } from "react-icons/ai";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/brightest_logo_black_yellow.png";
import "../styles/navbar.component.css";
import { UserRoleContext,  } from "../context/context";
import ParticipationMenu from "./globals/Participationmenu";

export default function Navbar() {
  const { isAuthenticated, user, loginWithRedirect, logout, isLoading } = useAuth0();
  const role = useContext(UserRoleContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const returnPath = () => {
    if (role === 'admin') {
      if (location.pathname === '/admin') {
        return {
          path: '/',
          name: 'Home'
        };
      } else if (location.pathname === '/') {
        return {
          path: '/admin',
          name: 'Admin'
        };
      }
    }
    return { path: '/', name: 'Home' }; 
  };

  const path = returnPath();
  
  const links = [
    { to: '/brightevents', text: 'Upcoming events' },
    { to: '/myparticipation', text: 'My participation' },
    { to: '/', text: 'My requests' },
  ];

  return (
    <nav>
      <Link to="/" className="bright-logo">
        <img src={logo} alt="bright-logo" />
      </Link>
      <ParticipationMenu links={links}/>
      {isAuthenticated ? (
        <div className="nav-links-loggedin">
          <Link to="/notifications" className="nav-notify">
            <IoIosNotificationsOutline />
          </Link>
          <div className="nav-login">
            <img src={user?.picture} alt="" className="nav-login-picture" />
            <p>{user?.nickname?.replace("."," ")}</p>
            {dropdownOpen ? (
              <AiOutlineDown className="nav-icon" onClick={toggleDropdown} />
            ) : (
              <AiOutlineRight className="nav-icon" onClick={toggleDropdown} />
            )}
            {dropdownOpen && (
              <div className="dropdown-menu">
                {<Link to={path.path}>{path.name}</Link>}
                {role === 'admin' && location.pathname !== '/admin' && location.pathname !== '/' ? <Link to={'/admin'}>Admin</Link> : <></>}
                <button onClick={() => logout({})}>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        !isLoading && (
          <div className="nav-links" onClick={() => loginWithRedirect()}>
            <p className="nav-login">Login</p>
            <AiOutlineRight className="nav-icon" />
          </div>
        )
      )}
    </nav>
  );
}
