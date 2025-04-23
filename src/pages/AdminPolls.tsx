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

  const polls: Poll[] = [
    {
      title: "Favorite Programming Language",
      description: "Vote for your favorite programming language.",
      image: "poll-image.jpg",
      createdBy: "Admin",
      location: "Online",
      address: "N/A",
      startDate: "2025-04-10",
      endDate: "2025-04-15",
      attendances: 100,
      subjects: [
        { id: "1", title: "JavaScript", votes: 50, percentage: 50 },
        { id: "2", title: "Python", votes: 50, percentage: 50 },
      ],
      declinedUsers: [],
      organizors: ["Admin"],
      validated: true,
      form: null,
      createdAt: "2025-04-01",
      updatedAt: "2025-04-05",
    },
    {
      title: "Best Frontend Framework",
      description: "Vote for the best frontend framework.",
      image: "poll-image-2.jpg",
      createdBy: "Admin",
      location: "Online",
      address: "N/A",
      startDate: "2025-05-01",
      endDate: "2025-05-10",
      attendances: 200,
      subjects: [
        { id: "1", title: "React", votes: 120, percentage: 60 },
        { id: "2", title: "Vue", votes: 80, percentage: 40 },
      ],
      declinedUsers: [],
      organizors: ["Admin"],
      validated: true,
      form: null,
      createdAt: "2025-04-20",
      updatedAt: "2025-04-25",
    },
  ];

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
