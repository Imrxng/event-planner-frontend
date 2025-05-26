import { useContext, useEffect, useState } from "react";
import LinkBack from "../components/LinkBack";
import "../styles/Admin.component.css";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { UserContext, UserRoleContext } from "../context/context";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import Unauthorized from "../components/Unauthorized";
import useAccessToken from "../utilities/getAccesToken";
import { EventDashBoard, Poll, Report } from "../types/types";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa6";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import DeleteReportModal from "../modals/DeleteReportModal";
import Pagination from "../components/globals/Pagination";

const Admin = () => {
  const [countEvents, setCountEvents] = useState<number>(0);
  const [countUsers, setCountUsers] = useState<number>(0);
  const [countPolls, setCountPolls] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteReportModal, setDeleteReportModal] = useState<boolean>(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [events, setEvents] = useState<EventDashBoard[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 4;
  const pagesPerGroup = 4;
  const navigate = useNavigate();
  const role = useContext(UserRoleContext);
  const { getAccessToken } = useAccessToken();
  const { user, loadingUser } = useContext(UserContext);
  const server = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const countItems = async () => {
      try {
        setLoading(true);
        const token = await getAccessToken();
        const [
          responseEventsCount,
          responsePollsCount,
          responseUsers,
          responseEvents,
          responsePolls,
          responseReports,
        ] = await Promise.all([
          fetch(`${server}/api/events/count`, {
            method: "GET",
            headers: { authorization: `Bearer ${token}` },
          }),
          fetch(`${server}/api/polls/count`, {
            method: "GET",
            headers: { authorization: `Bearer ${token}` },
          }),
          fetch(`${server}/api/users/count`, {
            method: "GET",
            headers: { authorization: `Bearer ${token}` },
          }),
          fetch(`${server}/api/events/waiting-for-approval/limited?limit=4`, {
            method: "GET",
            headers: { authorization: `Bearer ${token}` },
          }),
          fetch(`${server}/api/polls/all?limit=4`, {
            method: "GET",
            headers: { authorization: `Bearer ${token}` },
          }),
          fetch(`${server}/api/reports`, {
            method: "GET",
            headers: { authorization: `Bearer ${token}` },
          }),
        ]);

        if (!responseEventsCount.ok) {
          throw new Error("Failed to fetch event count");
        }
        if (!responsePollsCount.ok) {
          throw new Error("Failed to fetch poll count");
        }
        if (!responseUsers.ok) {
          throw new Error("Failed to fetch user data");
        }
        if (!responseEvents.ok) {
          throw new Error("Failed to fetch events");
        }
        if (!responsePolls.ok) {
          throw new Error("Failed to fetch polls");
        }
        if (!responseReports.ok) {
          throw new Error("Failed to fetch reports");
        }

        const eventCount = await responseEventsCount.json();
        const pollCount = await responsePollsCount.json();
        const userData = await responseUsers.json();
        const eventsData = await responseEvents.json();
        const pollsData = await responsePolls.json();
        const reportsData = await responseReports.json();

        setCountEvents(eventCount.count);
        setCountPolls(pollCount.count);
        setCountUsers(userData.count);
        setEvents(eventsData.events);
        setPolls(pollsData.polls);
        setReports(reportsData.reports);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    countItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [server]);

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);
  if (!user) return;

  return (
    <>
      <AuthenticatedTemplate>
        {role !== "admin" && !loadingUser ? (
          <Unauthorized />
        ) : loading ? (
          <FullscreenLoader content="Gathering data..." />
        ) : (
          <div className="admin-container">
            <>
              {deleteReportModal && selectedReport && (
                <DeleteReportModal
                  onClose={() => {
                    setDeleteReportModal(false);
                    setSelectedReport(null);
                  }}
                  report={selectedReport}
                  reports={reports}
                  setReports={setReports}
                />
              )}
            </>

            <LinkBack href={"/"} />
            <div className="header-block">
              <div className="block">
                <span className="first-letter">{countPolls}</span>
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
                <h2>Pending Event Approvals</h2>
                <ul>
                  {events.length === 0 ? (
                    <li>No approvals needed.</li>
                  ) : (
                    events.map((event, index) => (
                      <li key={index}>
                        {event.title}
                        <br />
                        <div className="event-request-bottom">
                          <small>Requested by {event.createdBy}</small>
                          <span className="actions">
                            <Link
                              to={"/brightadmin/events"}
                              state={{ search: event.title, filter: "pending" }}
                              className="edit"
                            >
                              <FaArrowRight className="redirect" />
                            </Link>
                          </span>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
                <button id="view-all-events">
                  <Link
                    to={"/brightadmin/events"}
                    state={{ filter: "pending" }}
                  >
                    View All Pending Events
                  </Link>
                </button>
              </div>

              <div className="main-container-right">
                <h2>Recent Polls</h2>
                <ul>
                  {polls.length === 0 ? (
                    <li>No recent polls.</li>
                  ) : (
                    polls.map((poll, index) => (
                      <li key={index}>
                        {poll.question}
                        <br />
                        <div className="event-request-bottom">
                          <small>Created by {poll.createdByUsername}</small>
                          <span className="actions">
                            <Link
                              to={`/brightadmin/polls`}
                              state={{ search: poll.question }}
                              className="edit"
                            >
                              <FaArrowRight className="redirect" />
                            </Link>
                          </span>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
                <button
                  id="view-all-polls"
                  onClick={() => navigate("/brightadmin/polls")}
                >
                  View All Polls
                </button>
              </div>
            </div>

            <div className="Reports-block">
              <h1>Reports</h1>
              <table>
                <thead>
                  <tr>
                    <th>Report</th>
                    <th className="optional">Reporter</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr>
                      <td>No reports at the moment</td>
                      <td className="optional"></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ) : (
                    currentReports.map((report, index) => (
                      <tr key={index}>
                        <td>{report.reportData}</td>
                        <td className="optional">{report.userId}</td>
                        <td>{report.reportType}</td>
                        <td>
                          <Link
                            to={
                              report.reportType === "event"
                                ? `/brightevents/${report.targetId}`
                                : `/brightpolls/${report.targetId}`
                            }
                            state={{ admin: "/brightadmin" }}
                            className="edit"
                          >
                            <HiOutlinePencilSquare />
                          </Link>
                          <button className="delete">
                            <RiDeleteBinLine
                              onClick={() => {
                                setDeleteReportModal(true);
                                setSelectedReport(report);
                              }}
                            />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {currentReports.length > 0 && (
              <Pagination
                setCurrentPage={setCurrentPage}
                itemsList={reports}
                itemsPerPage={reportsPerPage}
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

export default Admin;
