import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";
import "../../styles/searchbar.component.css";

interface SearchbarProps {
  search: string;
  setOnsearch: (query: string) => void;
}

const Searchbar = ({ setOnsearch }: SearchbarProps) => {
  const [searchable, setsearchable] = useState<string>("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOnsearch(searchable);
  };

  return (
    <div className="searchbar_Container">
      <div id="link-terug-container">
        <MdOutlineKeyboardBackspace />
        <Link to={"/"} className="Link-terug">
          Back
        </Link>
      </div>
      <form id="brightEvents_Search" onChange={handleSearch}>
        <input
          id="search_searchBar"
          type="search"
          placeholder="Search"
          onChange={(e) => setsearchable(e.target.value)}
          value={searchable}
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
