import { useContext, useState } from "react";
import AdminTable from "../components/globals/AdminTable";
import Pagination from "../components/globals/Pagination";
import Searchbar from "../components/globals/Searchbar";
import { UserRoleContext } from "../context/context";
import "../styles/AdminTablePages.component.css";
import { Poll } from "../types/types";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import Unauthorized from "../components/Unauthorized";

const AdminPolls = () => {
  const [searchable, setsearchable] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const eventsPerPage = 5; 
  const pagesPerGroup = 5; 
  const role = useContext(UserRoleContext);

  useEffect(() => {
      const initialize = async () => {
        if (!user) {
          return;
        }
        try {
          setLoading(true);
          const token = await getAccessToken();
          const response = await fetch(
            `${server}/api/events/admin-all/${user._id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch events");
          }
  
          const data = await response.json();
  
          const sortedEvents = data.events.sort((a: Event, b: Event) => {
            const dateA = new Date(a.startDate);
            const dateB = new Date(b.startDate);
            return dateB.getTime() - dateA.getTime();
          });
          setsearchable(location.state?.search || "");
          setEvents(sortedEvents);
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
    poll.title.toLowerCase().startsWith(searchable.toLowerCase())
  );

  const indexOfLastPoll = currentPage * eventsPerPage;
  const indexOfFirstPoll = indexOfLastPoll - eventsPerPage;
  const currentPolls = filteredPolls.slice(indexOfFirstPoll, indexOfLastPoll);

  return (
    <>
      <AuthenticatedTemplate>
        {
          role !== "admin" ? <Unauthorized /> :
            <div className="adminGeneral-container">
              <Searchbar
                search={searchable}
                setOnsearch={setsearchable}
                linkback="/brightadmin"
              />
              <AdminTable list={currentPolls as Poll[]} />
              <Pagination
                setCurrentPage={setCurrentPage}
                itemsList={filteredPolls}
                itemsPerPage={eventsPerPage}
                currentPage={currentPage}
                pagesPerGroup={pagesPerGroup}
              />
            </div>
        }
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Unauthorized />
      </UnauthenticatedTemplate>
    </>
  );
};

export default AdminPolls;
