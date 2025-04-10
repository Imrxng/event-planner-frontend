import { withAuthenticationRequired } from "@auth0/auth0-react";
import { SetStateAction, useContext, useState } from "react";
import LinkBack from "../components/LinkBack";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { UserRoleContext } from "../context/context";
import "../styles/Adminpolls.component.css";
import Searchbar from "../components/globals/Searchbar";
import { HiOutlinePencilSquare,HiOutlineTrash  } from "react-icons/hi2";
import Pagination from "../components/globals/Pagination";

const AdminPolls = () => {
    const [searchable, setsearchable] = useState<string>("");
  const role = useContext(UserRoleContext);
  if (role !== "admin") {
    window.history.back();
  }
  return (
    <div className="adminPolls-container">
        <div className="adminPolls-header">
      <Searchbar search={searchable} setOnsearch={setsearchable} />
      </div>
      <div className="adminPolls-content">
        <table className="adminPolls-table">
            <thead>
                <tr>
                    <th>Question</th>
                    <th>Created by</th>
                    <th>Total votes</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>What is your favorite color?</td>
                    <td>Admin</td>
                    <td>42</td>
                    <td>
                        <button className="adminPolls-button-edit"><HiOutlinePencilSquare/></button>
                        <button className="adminPolls-button-delete"><HiOutlineTrash /></button>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>

    </div>
  );
};

const AdminPollsPage = withAuthenticationRequired(AdminPolls, {
  onRedirecting: () => <FullscreenLoader content="Redirecting..." />,
});

export default AdminPollsPage;
