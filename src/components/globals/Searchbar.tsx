import { IoIosSearch } from "react-icons/io";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";
import "../../styles/searchbar.component.css";
import { SearchbarProps } from "../../types/types";
import LocationSelector from "./LocationSelector";

const Searchbar = ({ setOnsearch , search,locatiefilter, setLocatiefilter}: SearchbarProps) => {

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
      <LocationSelector locatiefilter={locatiefilter} setLocatiefilter={setLocatiefilter} />
    </div>
  );
};

export default Searchbar;
