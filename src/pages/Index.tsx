import { Link, useNavigate } from "react-router-dom";
import sfeerbeeld from "../assets/images/sfeerbeeld2.webp";
import "../styles/home.component.css";
import { useIsAuthenticated } from "@azure/msal-react";

const Index = () => {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      e.preventDefault();
    }
  };

  return (
    <div className="home_container">
      <div className="home_Textcontent">
        <h1>Discover Join Enjoy</h1>
        <h2>Find your next event or share your own!</h2>
        <p>
          A unique event platform from Brightest just for YOU. From workshops to
          team outings, from networking events to casual meetups, our platform
          connects you with exciting opportunities tailored to your interests.
        </p>
        <h3>Join the fun!</h3>
        <div className="home_buttons">
          <Link
            to={"/brightevents"}
            className={`home_Link1 ${!isAuthenticated ? "disabled" : ""}`}
            onClick={(e) => handleClick(e, "/brightevents")}
          >
            BrightEvents
          </Link>
          <Link
            to={"/brightpolls"}
            className={`home_Link2 ${!isAuthenticated ? "disabled" : ""}`}
            onClick={(e) => handleClick(e, "/brightpolls")}
          >
            BrightPolls
          </Link>
        </div>
      </div>
      <img src={sfeerbeeld} alt="" id="home_image" />
    </div>
  );
};

export default Index;
