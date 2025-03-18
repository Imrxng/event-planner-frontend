import { IoIosSearch } from "react-icons/io";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";
import "../../styles/searchbar.component.css";

interface SearchbarProps {
  search: string;
  setOnsearch: (query: string) => void;
}

const Searchbar = ({ setOnsearch , search}: SearchbarProps) => {

  return (
    <div className="searchbar_Container">
      <div id="link-terug-container">
        <MdOutlineKeyboardBackspace />
        <Link to={"/"} className="Link-terug">
          Back
        </Link>
      </div>
      <form id="brightEvents_Search" >
        <input
          id="search_searchBar"
          type="search"
          placeholder="Search"
          onChange={(e) => setOnsearch(e.target.value)}
          value={search}
        />
        <button id="search_submitButton" type="submit">
          <IoIosSearch className="submitButton-icon" />
        </button>
      </form>
      <p></p>
    </div>
  );
};

export default Searchbar;
