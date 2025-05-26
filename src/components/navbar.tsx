import { InteractionStatus } from "@azure/msal-browser";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useContext, useEffect, useState } from "react";
import { AiOutlineDown, AiOutlineRight } from "react-icons/ai";
import { IoIosLogOut, IoIosNotificationsOutline } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";
import brightAdminLogo from "../assets/images/brightadmin.webp";
import logoHome from "../assets/images/brightest_logo_black_yellow.webp";
import logoSmall from "../assets/images/brightest_logo_small.webp";
import brightEventsLogo from "../assets/images/brightevents.webp";
import brightPollsLogo from "../assets/images/brightpolls.webp";
import profile from "../assets/images/profile.webp";
import {
  NotificationContext,
  UserContext,
  UserRoleContext,
} from "../context/context";
import { loginRequest } from "../providers/loginRequest";
import "../styles/navbar.component.css";
import useAccessToken from "../utilities/getAccesToken";
import { fetchImageWithToken } from "../utilities/imageUtilities";
import ParticipationMenu from "./globals/Participationmenu";
import FullscreenLoader from "./spinner/FullscreenLoader";

export default function Navbar() {
  const { instance, inProgress } = useMsal();
  const { user } = useContext(UserContext);
  const isAuthenticated = useIsAuthenticated();
  const role = useContext(UserRoleContext);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null | undefined>(
    undefined,
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

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

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
    { to: "/brightevents", text: "All events" },
    { to: "/brightevents/participation", text: "Joined events" },
    { to: "/brightevents/requests", text: "New event" },
  ];
  const pollsmenulinks = [
    { to: "/brightpolls", text: "All polls" },
    { to: "/brightpolls/my-polls", text: "My polls" },
    { to: "/brightpolls/requests/new", text: "Create poll" },
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
    instance.logoutRedirect({
      postLogoutRedirectUri: "/",
    });
  };

  if (
    inProgress === "login" ||
    (isAuthenticated && !user) ||
    showFullscreenLoader
  ) {
    return <FullscreenLoader content="Logging in..." />;
  }
  const isLoggingIn =
    inProgress === InteractionStatus.HandleRedirect ||
    inProgress === InteractionStatus.AcquireToken;

  return (
    <>
      <nav className={!isAuthenticated ? "centered-nav" : ""}>
        {isLoggingIn && <FullscreenLoader content="Logging in..." />}
        <Link to="/" className="bright-logo">
          <img src={logo} alt="bright-logo" />
        </Link>
        <Link to="/" className="bright-logo-small">
          <img src={logoSmall} alt="bright-logo" />
        </Link>
        <div id="nav-menu">
          {shownEventlinks.includes(location.pathname) && (
            <ParticipationMenu links={eventmenulinks} />
          )}
          {shownPollslinks.includes(location.pathname) && (
            <ParticipationMenu links={pollsmenulinks} />
          )}

          {shownAdminlinks.includes(location.pathname) && (
            <ParticipationMenu links={adminLinks} />
          )}
        </div>
        {isAuthenticated && (
          <div
            className="mobile-hamburger"
            onClick={() => setIsDrawerOpen(true)}
          >
            <IoMenu />
          </div>
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
                  {location.pathname !== "/brightpolls/my-polls" &&
                    location.pathname !== "/brightpolls" &&
                    location.pathname !== "/brightpolls/requests/new" && (
                      <Link
                        to="/brightpolls/my-polls"
                        className={
                          location.pathname === "/brightpolls/my-polls"
                            ? "active-link"
                            : ""
                        }
                        state={{ linkBack: location.pathname }}
                      >
                        My polls
                      </Link>
                    )}

                  <Link
                    to="/brightevents/my-events"
                    className={
                      location.pathname === "/brightevents/my-events"
                        ? "active-link"
                        : ""
                    }
                    state={{ linkBack: location.pathname }}
                  >
                    My events
                  </Link>
                  <div id="dropdown-participation">
                    {shownEventlinks.includes(location.pathname) &&
                      eventmenulinks.map((link, index) => (
                        <Link to={link.to} key={index}>
                          {link.text}
                        </Link>
                      ))}
                    {shownAdminlinks.includes(location.pathname) &&
                      adminLinks.map((link, index) => (
                        <Link to={link.to} key={index}>
                          {link.text}
                        </Link>
                      ))}
                    {shownPollslinks.includes(location.pathname) &&
                      pollsmenulinks.map((link, index) => (
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
          !isLoggingIn && (
            <div
              className="nav-links mobile-login-button"
              onClick={handleLogin}
            >
              <button className="nav-login">Login</button>
              <AiOutlineRight className="nav-icon" />
            </div>
          )
        )}
      </nav>
      {isDrawerOpen && (
        <div className={`drawer-overlay ${isDrawerOpen ? "open" : ""}`}>
          <div className="drawer-content">
            <div className="drawer-header">
              <button
                className="close-drawer"
                onClick={() => setIsDrawerOpen(false)}
              >
                <RxCross1 />
              </button>
              <img
                src={
                  user && user.picture !== "not-found"
                    ? profilePic || profile
                    : profile
                }
                alt="profile"
                className="drawer-profile-pic"
              />
              <div id="drawer-name-noti-container">
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
                <p>{user?.name}</p>
              </div>
            </div>

            <div className="drawer-links">
              <Link to={path.path}>{path.name}</Link>
              {role === "admin" &&
                location.pathname !== "/brightadmin" &&
                location.pathname !== "/" && (
                  <Link to="/brightadmin">Admin</Link>
                )}

              {location.pathname !== "/brightpolls/my-polls" &&
                location.pathname !== "/brightpolls" &&
                location.pathname !== "/brightpolls/requests/new" && (
                  <Link
                    to="/brightpolls/my-polls"
                    className={
                      location.pathname === "/brightpolls/my-polls"
                        ? "active-link"
                        : ""
                    }
                    state={{ linkBack: location.pathname }}
                  >
                    My polls
                  </Link>
                )}

              <Link
                to="/brightevents/my-events"
                className={
                  location.pathname === "/brightevents/my-events"
                    ? "active-link"
                    : ""
                }
                state={{ linkBack: location.pathname }}
              >
                My events
              </Link>
              {shownEventlinks.includes(location.pathname) &&
                eventmenulinks.map((link, i) => (
                  <Link
                    to={link.to}
                    key={i}
                    className={
                      location.pathname === link.to ? "active-link" : ""
                    }
                  >
                    {link.text}
                  </Link>
                ))}
              {shownPollslinks.includes(location.pathname) &&
                pollsmenulinks.map((link, i) => (
                  <Link
                    to={link.to}
                    key={i}
                    className={
                      location.pathname === link.to ? "active-link" : ""
                    }
                  >
                    {link.text}
                  </Link>
                ))}
              {shownAdminlinks.includes(location.pathname) &&
                adminLinks.map((link, i) => (
                  <Link
                    to={link.to}
                    key={i}
                    className={
                      location.pathname === link.to ? "active-link" : ""
                    }
                  >
                    {link.text}
                  </Link>
                ))}
            </div>
            <button id="nav-drawer-logout" onClick={handleLogout}>
              Logout
              <IoIosLogOut />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
