import { IoIosSearch } from "react-icons/io";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";
import "../../styles/Searchbar.component.css";
import LocationSelector from "./LocationSelector";
import { useContext } from "react";
import { UserContext } from "../../context/context";

export interface SearchbarProps {
  search: string;
  setOnsearch: (query: string) => void;
  locatiefilter?: string;
  setLocatiefilter?: React.Dispatch<React.SetStateAction<string>>;
  linkback?: string;
}

const Searchbar = ({
  setOnsearch,
  search,
  locatiefilter,
  setLocatiefilter,
  linkback,
}: SearchbarProps) => {
  const { user } = useContext(UserContext);
  if (!user) {
    return;
  }
  return (
    <div className="searchbar_Container">
      <div id="link-terug-container">
        <MdOutlineKeyboardBackspace />
        <Link to={linkback || "/"} className="Link-terug">
          Back
        </Link>
      </div>
      <form
        id="brightEvents_Search"
        style={{
          marginLeft:
            user.location === "all" && locatiefilter && setLocatiefilter
              ? "12rem"
              : 0,
        }}
      >
        <input
          id="search_searchBar"
          type="search"
          placeholder="Search"
          onChange={(e) => setOnsearch(e.target.value)}
          value={search}
        />
        <button id="search_submitButton" aria-label="Search">
          <IoIosSearch className="submitButton-icon" />
        </button>
      </form>
      {user.location === "all" && locatiefilter && setLocatiefilter ? (
        <LocationSelector
          locatiefilter={locatiefilter}
          setLocatiefilter={setLocatiefilter}
        />
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default Searchbar;
