import { useContext, useEffect, useState } from "react";
import LinkBack from "../components/LinkBack";
import "../styles/Admin.component.css";
import { useNavigate } from "react-router-dom";
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import { UserContext, UserRoleContext } from '../context/context';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import Unauthorized from "../components/Unauthorized";
import useAccessToken from "../utilities/getAccesToken";

const Admin = () => {
  const [countEvents, setCountEvents] = useState<number>(0);
  const [countUsers, setCountUsers] = useState<number>(0);
  const [countPolls, setCountPolls] = useState<number>(0);
  const navigate = useNavigate();
  const role = useContext(UserRoleContext);
  const { getAccessToken } = useAccessToken();
  const { user } = useContext(UserContext);
  const server = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const countItems = async () => {
      try {
        const token = await getAccessToken();

        const [responseEvents, responsePolls, responseUsers] = await Promise.all([
          fetch(`${server}/api/events/count`, {
            method: 'GET',
            headers: { 'authorization': `Bearer ${token}` },
          }),
          fetch(`${server}/api/polls/count`, {
            method: 'GET',
            headers: { 'authorization': `Bearer ${token}` },
          }),
          fetch(`${server}/api/users/count`, {
            method: 'GET',
            headers: { 'authorization': `Bearer ${token}` },
          }),
        ]);

        if (!responseEvents.ok) {
          throw new Error('Failed to fetch event count');
        }
        if (!responsePolls.ok) {
          throw new Error('Failed to fetch poll count');
        }
        if (!responseUsers.ok) {
          throw new Error('Failed to fetch user data');
        }

        const eventCount = await responseEvents.json();
        const pollCount = await responsePolls.json();
        const userData = await responseUsers.json();
        console.log(userData);
        
        setCountEvents(eventCount.count);
        setCountPolls(pollCount.count);
        setCountUsers(userData.count);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    }

      countItems();
    }, [server]);

  return (
    <>
      <AuthenticatedTemplate>
        {
          role !== "admin" ?
            <Unauthorized /> :
            <div className="admin-container">
              <LinkBack href={"/"} />
              <div className="header-block">
                <div className="block">
                  <span className="first-letter" >{countPolls}</span>
                  <br />
                  Polls
                </div>
                <div className="block">
                  <span className="first-letter">{countEvents}</span>
                  <br />
                  Events
                </div>
                <div className="block">
                  <span className="first-letter">{countUsers}</span>
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
        }

      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Unauthorized />
      </UnauthenticatedTemplate>
    </>
  );
};

export default Admin;