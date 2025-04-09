import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useState } from "react";
import { AiOutlineRight, AiOutlineDown } from "react-icons/ai";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import logoHome from "../assets/images/brightest_logo_black_yellow.webp";
import brightEventsLogo from "../assets/images/brightevents.webp";
import brightPollsLogo from "../assets/images/brightpolls.webp";
import "../styles/navbar.component.css";
import { UserRoleContext, } from "../context/context";
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

  const eventmenulinks = [
    { to: '/brightevents', text: 'Upcoming events' },
    { to: '/brightevents/participation', text: 'My participation' },
    { to: '/brightevents/requests', text: 'My requests' },
  ];
  const pollsmenulinks = [
    { to: '/brightpolls', text: 'All polls' },
    { to: '/', text: 'My polls' },
    { to: '/brightpolls/requests/new', text: 'Create polls' },
  ];

  const showneventlinks = ["/brightevents", "/brightevents/participation", "/brightevents/requests", "/brightevents/requests/declined", "/brightevents/requests/new"]
  const shownpollslinks = ["/brightpolls", '/brightpolls/requests/new'];
  let logo = logoHome;
  const locationPath = location.pathname;

  if (showneventlinks.some(link => locationPath.startsWith(link))) {
    logo = brightEventsLogo;
  } else if (shownpollslinks.some(link => locationPath.startsWith(link))) {
    logo = brightPollsLogo;
  }
  return (
    <nav>
      <Link to="/" className="bright-logo">
        <img src={logo} alt="bright-logo" />
      </Link>

      {showneventlinks.find((link) => link === location.pathname) && <ParticipationMenu links={eventmenulinks} />}
      {shownpollslinks.find((link) => link === location.pathname) && <ParticipationMenu links={pollsmenulinks} />}
      {isAuthenticated ? (
        <div className="nav-links-loggedin">
          <Link to="/notifications" className="nav-notify">
            <IoIosNotificationsOutline />
          </Link>
          <div className="nav-login">
            <img src={user?.picture} alt="" className="nav-login-picture" />
            <p>{user?.nickname?.replace(".", " ")}</p>
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
