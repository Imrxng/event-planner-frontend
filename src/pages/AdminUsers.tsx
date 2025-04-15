import { withAuthenticationRequired } from "@auth0/auth0-react";
import { useContext, useState } from "react";
import AdminTable from "../components/globals/AdminTable";
import Pagination from "../components/globals/Pagination";
import Searchbar from "../components/globals/Searchbar";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { UserRoleContext } from "../context/context";
import "../styles/AdminTablePages.component.css";
import { MongoDbUser } from "../types/types";

const AdminUsers = () => {
  const [searchable, setsearchable] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 5; // Number of users per page
  const pagesPerGroup = 5; // Number of pages to show in pagination
  const role = useContext(UserRoleContext);

  if (role !== "admin") {
    window.history.back();
  }

  const users: MongoDbUser[] = [
    {
      _id: "user1@example.com",
      role: "admin",
      location: "New York",
      notifications: [
        { type: "report", message: "You have a new report" },
        { type: "alert", message: "System maintenance scheduled" },
      ],
      createdAt: "2025-01-01T12:00:00Z",
      updatedAt: "2025-01-02T12:00:00Z",
      picture: "https://example.com/user1.jpg",
      name: "John Doe",
      __v: 0,
    },
    {
      _id: "user2@example.com",
      role: "user",
      location: "San Francisco",
      notifications: [],
      createdAt: "2025-01-01T12:00:00Z",
      updatedAt: "2025-01-02T12:00:00Z",
      picture: "https://example.com/user2.jpg",
      name: "Jane Smith",
      __v: 0,
    },
    // Add more users here...
  ];
  
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().startsWith(searchable.toLowerCase()) ||
    user._id.toLowerCase().startsWith(searchable.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="adminGeneral-container">
      <Searchbar
        search={searchable}
        setOnsearch={setsearchable}
        linkback="/admin"
      />
      <AdminTable list={currentUsers as MongoDbUser[]} />
      <Pagination
        setCurrentPage={setCurrentPage}
        itemsList={filteredUsers}
        itemsPerPage={usersPerPage}
        currentPage={currentPage}
        pagesPerGroup={pagesPerGroup}
      />
    </div>
  );
};

const AdminUsersPage = withAuthenticationRequired(AdminUsers, {
  onRedirecting: () => <FullscreenLoader content="Redirecting..." />,
});

export default AdminUsersPage;
