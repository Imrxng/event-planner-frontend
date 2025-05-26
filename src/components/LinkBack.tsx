import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";

interface LinkBackProps {
  href: string;
}

const LinkBack = ({ href }: LinkBackProps) => {
  return (
    <div id="link-terug-container">
      <MdOutlineKeyboardBackspace />
      <Link
        to={href}
        state={{ all: href === "/brightadmin/events" ? true : false }}
        className="Link-terug"
      >
        Back
      </Link>
    </div>
  );
};

export default LinkBack;
