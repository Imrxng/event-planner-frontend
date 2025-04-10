import { withAuthenticationRequired } from "@auth0/auth0-react";
import { use, useContext } from "react";
import LinkBack from "../components/LinkBack";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { UserRoleContext } from "../context/context";
import "../styles/Admin.component.css";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Admin = () => {
  const role = useContext(UserRoleContext);
  if (role !== "admin") {
    window.history.back();
  }
  return (
    <div className="admin-container">
      <LinkBack href={"/"} />
      <div className="header-block">
        <div className="block">
        <Link to={"/adminpolls"} >
          <span className="first-letter" >0</span>
          <br />
          Polls
          </Link>
        </div>
        <div className="block">
        <Link to={"/adminevents"} >
          <span className="first-letter">1</span>
          <br />
          Events
          </Link>
        </div>
        <div className="block">
          <span className="first-letter">3</span>
          <br />
          Users
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
          <button id="view-all-events">View All Pending Events</button>
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
          <button id="view-all-polls">View All Polls</button>
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
                <button className="edit">✏</button>
                <button className="delete">🗑</button>
              </td>
            </tr>
            <tr>
              <td>Preferred time for weekly community meetings?</td>
              <td>Lars Janssen</td>
              <td>
                <button className="edit">✏</button>
                <button className="delete">🗑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminPage = withAuthenticationRequired(Admin, {
  onRedirecting: () => <FullscreenLoader content="Redirecting..." />,
});

export default AdminPage;
