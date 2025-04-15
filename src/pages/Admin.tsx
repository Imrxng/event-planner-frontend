import { useContext } from "react";
import LinkBack from "../components/LinkBack";
import "../styles/Admin.component.css";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import { UserContext, UserRoleContext } from '../context/context';
import FullscreenLoader from '../components/spinner/FullscreenLoader';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import Unauthorized from "../components/Unauthorized";

const Admin = () => {
  const navigate = useNavigate();
  const role = useContext(UserRoleContext);
  const { user } = useContext(UserContext);


  if (!user || role !== "admin") {
    window.location.href = '/';
    return <FullscreenLoader content="Redirecting..." />;
  }

  return (
    <>
      <AuthenticatedTemplate>
        <div className="admin-container">
          <LinkBack href={"/"} />
          <div className="header-block">
            <div className="block">
              <Link to={"/admin-polls"} >
                <span className="first-letter" >0</span>
                <br />
                Polls
              </Link>
            </div>
            <div className="block">
              <Link to={"/admin-events"} >
                <span className="first-letter">1</span>
                <br />
                Events
              </Link>
            </div>
            <div className="block">
              <Link to={"/admin-users"} >
                <span className="first-letter">3</span>
                <br />
                Users
              </Link>
            </div>
          </div>
          <div className="main-block">
            <div className="main-container-left">
              <h2>Events Pending Approval</h2>
              <ul>
                <li>
                  Tech Workshop Series <br />
                  <div className="event-request-bottom">
                    <small>Requested by Jan Smith</small>
                    <span className="actions">
                      <button className="approve">✔</button>
                      <button className="reject">✖</button>
                    </span>
                  </div>
                </li>
                <li>
                  Networking Breakfast <br />
                  <div className="event-request-bottom">
                    <small>Requested by Peter de Vries</small>
                    <span className="actions">
                      <button className="approve">✔</button>
                      <button className="reject">✖</button>
                    </span>
                  </div>
                </li>
              </ul>
              <button id="view-all-events" onClick={() => navigate("/admin-events")}>View All Pending Events</button>
            </div>
            <div className="main-container-right">
              <h2>Recent Polls</h2>
              <ul>
                <li>
                  What topic would you like for the next tech meetup? <br />
                  <div className="poll-request-bottom">
                    <small>47 votes</small>
                    <button className="view-poll">→</button>
                  </div>
                </li>
                <li>
                  Preferred time for weekly community meetings? <br />
                  <div className="poll-request-bottom">
                    <small>25 votes</small>
                    <button className="view-poll">→</button>
                  </div>
                </li>
              </ul>
              <button id="view-all-polls" onClick={() => navigate("/admin-polls")}>View All Polls</button>
            </div>
          </div>
          <div className="Reports-block">
              <h1>Reports</h1>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Reporter</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>What topic would you like for the next tech meetup?</td>
                  <td>Emma de Vries</td>
                  <td>
                    <button className="edit"><HiOutlinePencilSquare /></button>
                    <button className="delete"><HiOutlineTrash /></button>
                  </td>
                </tr>
                <tr>
                  <td>Preferred time for weekly community meetings?</td>
                  <td>Lars Janssen</td>
                  <td>
                    <button className="edit"><HiOutlinePencilSquare /></button>
                    <button className="delete"><HiOutlineTrash /></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Unauthorized />
      </UnauthenticatedTemplate>
    </>
  );
};

export default Admin;