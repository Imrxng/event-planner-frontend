import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import {
  Event,
  MongoDbUser,
  Notification,
  Poll,
  Report,
} from "../../types/types";
import "../../styles/Pagination.component.css";

interface PaginationProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  itemsList:
    | Event[]
    | Poll[]
    | MongoDbUser[]
    | Notification[]
    | Report[]
    | undefined;
  itemsPerPage: number;
  currentPage: number;
  pagesPerGroup: number;
}

const Pagination = ({
  setCurrentPage,
  itemsList,
  itemsPerPage,
  currentPage,
  pagesPerGroup,
}: PaginationProps) => {
  const totalPages = itemsList ? Math.ceil(itemsList.length / itemsPerPage) : 0;
  const getPaginationRange = () => {
    const totalNumbers = pagesPerGroup;
    let startPage = Math.max(currentPage - Math.floor(totalNumbers / 2), 1);
    const endPage = Math.min(startPage + totalNumbers - 1, totalPages);

    if (endPage - startPage + 1 < totalNumbers) {
      startPage = Math.max(endPage - totalNumbers + 1, 1);
    }

    return { startPage, endPage };
  };
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const { startPage, endPage } = getPaginationRange();

  return (
    <div className="pagination">
      <button
        className="nav-button"
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
      >
        <IoMdArrowBack />
      </button>
      {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
        <button
          key={index}
          onClick={() => handlePageClick(startPage + index)}
          disabled={currentPage === startPage + index}
          className={`numbers-button ${
            currentPage === startPage + index ? "current-page" : ""
          }`}
        >
          {startPage + index}
        </button>
      ))}
      <button
        className="nav-button"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        <IoMdArrowForward />
      </button>
    </div>
  );
};

export default Pagination;
