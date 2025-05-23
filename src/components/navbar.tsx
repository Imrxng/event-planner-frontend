import { useContext, useEffect, useState } from "react";
import { AiOutlineRight, AiOutlineDown } from "react-icons/ai";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import logoHome from "../assets/images/brightest_logo_black_yellow.webp";
import logoSmall from "../assets/images/brightest_logo_small.webp";
import brightEventsLogo from "../assets/images/brightevents.webp";
import brightPollsLogo from "../assets/images/brightpolls.webp";
import brightAdminLogo from "../assets/images/brightadmin.webp";
import profile from "../assets/images/profile.webp";
import "../styles/navbar.component.css";
import {
  NotificationContext,
  UserContext,
  UserRoleContext,
} from "../context/context";
import ParticipationMenu from "./globals/Participationmenu";
import { loginRequest } from "../providers/loginRequest";
import FullscreenLoader from "./spinner/FullscreenLoader";
import { InteractionStatus } from "@azure/msal-browser";
import { fetchImageWithToken } from "../utilities/imageUtilities";
import useAccessToken from "../utilities/getAccesToken";

export default function Navbar() {
  const { instance, inProgress } = useMsal();
  const { user } = useContext(UserContext);
  const isAuthenticated = useIsAuthenticated();
  const role = useContext(UserRoleContext);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<string | null | undefined>(
    undefined
  );
  const { getAccessToken } = useAccessToken();
  const [showFullscreenLoader, setShowFullscreenLoader] =
    useState<boolean>(false);
  const { notifications } = useContext(NotificationContext);
  const location = useLocation();

  useEffect(() => {
    const fetchPicture = async () => {
      if (!user) return;
      const token = await getAccessToken();
      const blobUrl = await fetchImageWithToken(user?._id, token);
      setProfilePic(blobUrl);
    };
    fetchPicture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const returnPath = () => {
    if (role === "admin") {
      if (location.pathname === "/brightadmin") {
        return { path: "/", name: "Home" };
      } else if (location.pathname === "/") {
        return { path: "/brightadmin", name: "Admin" };
      }
    }
    return { path: "/", name: "Home" };
  };

  const path = returnPath();

  const eventmenulinks = [
    { to: "/brightevents", text: "Upcoming events" },
    { to: "/brightevents/participation", text: "My participation" },
    { to: "/brightevents/requests", text: "My requests" },
  ];
  const pollsmenulinks = [
    { to: "/brightpolls", text: "All polls" },
    { to: "/brightpolls/my-polls", text: "My polls" },
    { to: "/brightpolls/requests/new", text: "Create polls" },
  ];

  const adminLinks = [
    { to: "/brightadmin", text: "Dashboard" },
    { to: "/brightadmin/events", text: "Events" },
    { to: "/brightadmin/polls", text: "Polls" },
    { to: "/brightadmin/users", text: "Users" },
  ];

  const shownEventlinks = [
    "/brightevents",
    "/brightevents/participation",
    "/brightevents/requests",
    "/brightevents/requests/declined",
    "/brightevents/requests/new",
  ];

  const shownAdminlinks = [
    "/brightadmin",
    "/brightadmin/polls",
    "/brightadmin/events",
    "/brightadmin/users",
  ];

  const shownPollslinks = [
    "/brightpolls",
    "/brightpolls/requests/new",
    "/brightpolls/my-polls",
  ];

  let logo = logoHome;
  const locationPath = location.pathname;

  if (shownEventlinks.some((link) => locationPath.startsWith(link))) {
    logo = brightEventsLogo;
  } else if (shownPollslinks.some((link) => locationPath.startsWith(link))) {
    logo = brightPollsLogo;
  } else if (shownAdminlinks.some((link) => locationPath.startsWith(link))) {
    logo = brightAdminLogo;
  }

  const handleLogin = () => {
    setShowFullscreenLoader(true);
    setTimeout(() => {
      instance.loginRedirect(loginRequest);
      setShowFullscreenLoader(false);
    }, 2000);
  };

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  if (
    inProgress === "login" ||
    (isAuthenticated && !user) ||
    showFullscreenLoader
  ) {
    <FullscreenLoader content="logging in..." />;
  }

  return (
    <nav>
      {inProgress === InteractionStatus.Login && (
        <FullscreenLoader content="Logging in..." />
      )}
      <Link to="/" className="bright-logo">
        <img src={logo} alt="bright-logo" />
      </Link>
      <Link to="/" className="bright-logo-small">
        <img src={logoSmall} alt="bright-logo" />
      </Link>
      {shownEventlinks.includes(location.pathname) && (
        <ParticipationMenu links={eventmenulinks} />
      )}
      {shownPollslinks.includes(location.pathname) && (
        <ParticipationMenu links={pollsmenulinks} />
      )}

      {shownAdminlinks.includes(location.pathname) && (
        <ParticipationMenu links={adminLinks} />
      )}

      {isAuthenticated && user ? (
        <div className="nav-links-loggedin">
          <Link
            to="/notifications"
            className="nav-notify"
            state={{ linkBack: location.pathname }}
          >
            <IoIosNotificationsOutline />
            {notifications.some((noti) => !noti.read) && (
              <div id="nav-notify-number">
                {notifications.filter((noti) => !noti.read).length}
              </div>
            )}
          </Link>
          <div className="nav-login" onClick={toggleDropdown}>
            <img
              src={
                user && user.picture !== "not-found"
                  ? profilePic || profile
                  : profile
              }
              alt=""
              className="nav-login-picture"
            />
            <p>{user && user.name}</p>
            {dropdownOpen ? (
              <AiOutlineDown className="nav-icon" />
            ) : (
              <AiOutlineRight className="nav-icon" />
            )}
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to={path.path}>{path.name}</Link>
                {role === "admin" &&
                  location.pathname !== "/brightadmin" &&
                  location.pathname !== "/" && (
                    <Link to="/brightadmin">Admin</Link>
                  )}
                <div id="dropdown-participation">
                {shownEventlinks.includes(location.pathname) &&
                  eventmenulinks.map((link, index) => (
                    <Link to={link.to} key={index}>
                      {link.text}
                    </Link>
                  ))}
                  </div>
                <button onClick={handleLogout}>Log out</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        inProgress !== "login" && (
          <div className="nav-links" onClick={handleLogin}>
            <p className="nav-login">Login</p>
            <AiOutlineRight className="nav-icon" />
          </div>
        )
      )}
    </nav>
  );
}
