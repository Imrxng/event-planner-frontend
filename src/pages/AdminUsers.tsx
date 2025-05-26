import { useContext, useEffect, useState } from "react";
import AdminTable from "../components/globals/AdminTable";
import Pagination from "../components/globals/Pagination";
import Searchbar from "../components/globals/Searchbar";
import { UserContext, UserRoleContext } from "../context/context";
import "../styles/AdminTablePages.component.css";
import { MongoDbUser } from "../types/types";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import Unauthorized from "../components/Unauthorized";
import { fetchImageWithToken } from "../utilities/imageUtilities";
import useAccessToken from "../utilities/getAccesToken";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import EditUserAdminModal from "../modals/EditUserAdminModal";
import DeleteUserAdminModal from "../modals/DeleteUserAdminModal";

const AdminUsers = () => {
  const [users, setUsers] = useState<MongoDbUser[]>([]);
  const [searchable, setsearchable] = useState<string>("");
  const [selectedItemUser, setSelectedItemUser] = useState<MongoDbUser | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [popUpEditModal, setPopUpEditModal] = useState<boolean>(false);
  const [popUpDeleteModal, setPopUpDeleteModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const role = useContext(UserRoleContext);
  const { user, loadingUser } = useContext(UserContext);
  const { getAccessToken } = useAccessToken();
  const server = import.meta.env.VITE_SERVER_URL;
  const usersPerPage = 5;
  const pagesPerGroup = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        if (!user) {
          return;
        }
        const token = await getAccessToken();
        const response = await fetch(`${server}/api/users`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch event data");
        }

        const data: { users: MongoDbUser[] } = await response.json();
        const allUsers = await Promise.all(
          data.users.map(async (dataUser) => {
            const imageUrl = await fetchImageWithToken(dataUser._id, token);

            return { ...dataUser, picture: imageUrl || dataUser.picture };
          }),
        );
        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, server]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().startsWith(searchable.toLowerCase()) ||
      user._id.toLowerCase().startsWith(searchable.toLowerCase()),
  );

  useEffect(() => {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [searchable, currentPage, filteredUsers.length]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <>
      <AuthenticatedTemplate>
        {role !== "admin" && !loadingUser ? (
          <Unauthorized />
        ) : (
          <div className="adminGeneral-container adminUsers-container">
            {loading && <FullscreenLoader content="Gathering data..." />}
            <Searchbar
              search={searchable}
              setOnsearch={setsearchable}
              linkback="/brightadmin"
            />
            {popUpEditModal && (
              <EditUserAdminModal
                onClose={setPopUpEditModal}
                userEdit={selectedItemUser}
              />
            )}
            {popUpDeleteModal && (
              <DeleteUserAdminModal
                onClose={setPopUpDeleteModal}
                userIdToDelete={selectedItemUser?._id || ""}
              />
            )}
            <AdminTable
              list={currentUsers as MongoDbUser[]}
              setSelectedUser={setSelectedItemUser}
              setPopupEditUser={setPopUpEditModal}
              setPopupDeleteUser={setPopUpDeleteModal}
            />
            {filteredUsers.length > 0 && (
              <Pagination
                setCurrentPage={setCurrentPage}
                itemsList={filteredUsers}
                itemsPerPage={usersPerPage}
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

export default AdminUsers;
