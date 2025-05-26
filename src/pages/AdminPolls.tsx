import { useContext, useEffect, useState } from "react";
import AdminTable from "../components/globals/AdminTable";
import Pagination from "../components/globals/Pagination";
import Searchbar from "../components/globals/Searchbar";
import { UserContext, UserRoleContext } from "../context/context";
import "../styles/AdminTablePages.component.css";
import { Poll } from "../types/types";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import Unauthorized from "../components/Unauthorized";
import useAccessToken from "../utilities/getAccesToken";
import { useLocation } from "react-router-dom";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import DeletePollModal from "../modals/DeletePollModal";

const AdminPolls = () => {
  const [searchable, setsearchable] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [popupDeletePoll, setPopUpDeletePoll] = useState<boolean>(false);
  const [selectedItemPoll, setSelectedItemPoll] = useState<Poll | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);

  const pollsPerPage = 5;
  const pagesPerGroup = 5;
  const { user, loadingUser } = useContext(UserContext);
  const { getAccessToken } = useAccessToken();
  const location = useLocation();
  const server = import.meta.env.VITE_SERVER_URL;

  const role = useContext(UserRoleContext);

  useEffect(() => {
    const initialize = async () => {
      if (!user) {
        return;
      }
      try {
        setLoading(true);
        const token = await getAccessToken();
        const response = await fetch(`${server}/api/polls/all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();

        const sortedPolls = data.polls.sort((a: Poll, b: Poll) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
        setsearchable(location.state?.search || "");
        setPolls(sortedPolls);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, server]);

  const filteredPolls = polls.filter((poll) =>
    poll.question.toLowerCase().startsWith(searchable.toLowerCase()),
  );

  useEffect(() => {
    const totalPages = Math.ceil(filteredPolls.length / pollsPerPage);

    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [searchable, filteredPolls, currentPage, pollsPerPage]);

  const indexOfLastPoll = currentPage * pollsPerPage;
  const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;
  const currentPolls = filteredPolls.slice(indexOfFirstPoll, indexOfLastPoll);

  return (
    <>
      <AuthenticatedTemplate>
        {role !== "admin" && !loadingUser ? (
          <Unauthorized />
        ) : (
          <div className="adminGeneral-container adminPolls-container">
            {loading && <FullscreenLoader content="Gathering data..." />}
            <Searchbar
              search={searchable}
              setOnsearch={setsearchable}
              linkback="/brightadmin"
            />
            {popupDeletePoll && (
              <DeletePollModal
                onClose={setPopUpDeletePoll}
                poll={selectedItemPoll}
                navigateLink={"/brightadmin/polls"}
                polls={polls}
                setPolls={setPolls}
              />
            )}
            <AdminTable
              list={currentPolls as Poll[]}
              setSelectedPoll={setSelectedItemPoll}
              setPopupDeletePoll={setPopUpDeletePoll}
            />
            {filteredPolls.length > 0 && (
              <Pagination
                setCurrentPage={setCurrentPage}
                itemsList={filteredPolls}
                itemsPerPage={pollsPerPage}
                currentPage={currentPage}
                pagesPerGroup={pagesPerGroup}
              />
            )}
          </div>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Unauthorized />
      </UnauthenticatedTemplate>
    </>
  );
};

export default AdminPolls;
