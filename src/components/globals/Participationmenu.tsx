import { AuthenticatedTemplate } from "@azure/msal-react";
import { Link, useLocation } from "react-router-dom";

interface ParticipationMenuProps {
  links: { to: string; text: string }[];
}

const ParticipationMenu = ({ links }: ParticipationMenuProps) => {
  const location = useLocation();
  return (
    <>
      <AuthenticatedTemplate>
        <div className="participation-menu">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className={location.pathname === link.to ? "active-link" : ""}
            >
              {link.text}
            </Link>
          ))}
        </div>
      </AuthenticatedTemplate>
    </>
  );
};

export default ParticipationMenu;
